import crypto from "node:crypto";
import admin from "firebase-admin";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://kuroza.co.uk",
  "https://www.kuroza.co.uk",
  "https://kuroza.netlify.app",
  "http://localhost:8888",
  "http://localhost:3000"
];

export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

export function getClientIp(event) {
  return (
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function isAllowedOrigin(event) {
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowList = allowed.length ? allowed : DEFAULT_ALLOWED_ORIGINS;

  const origin = event.headers.origin || "";
  const referer = event.headers.referer || "";

  if (!origin && !referer) return false;
  return allowList.some((item) => origin.startsWith(item) || referer.startsWith(item));
}

export function parseBody(event) {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return {};
  }
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
}

export function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function base64url(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function unbase64url(str) {
  const pad = 4 - (str.length % 4 || 4);
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(normalized, "base64").toString("utf8");
}

export function signToken(payload) {
  const secret = process.env.DELETION_TOKEN_SECRET;
  if (!secret) throw new Error("DELETION_TOKEN_SECRET missing");

  const payloadEnc = base64url(JSON.stringify(payload));
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payloadEnc)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${payloadEnc}.${sig}`;
}

export function verifyToken(token) {
  const secret = process.env.DELETION_TOKEN_SECRET;
  if (!secret) throw new Error("DELETION_TOKEN_SECRET missing");
  const [payloadEnc, sig] = (token || "").split(".");
  if (!payloadEnc || !sig) throw new Error("Invalid token format");

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payloadEnc)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error("Invalid token signature");

  const payload = JSON.parse(unbase64url(payloadEnc));
  if (!payload.exp || Date.now() > payload.exp) throw new Error("Token expired");
  return payload;
}

export function initFirebaseAdmin() {
  if (admin.apps.length) return admin;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT missing");

  const serviceAccount = JSON.parse(raw);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined
  });

  return admin;
}

export async function verifyCaptcha(token, ip) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const params = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip || ""
  });

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params
  });

  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data.success);
}

export async function rateLimit({ db, key, limit, windowMs }) {
  const ref = db.collection("deletionRateLimits").doc(key);
  const now = Date.now();

  const allowed = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      tx.set(ref, { count: 1, windowStart: now, updatedAt: now });
      return true;
    }

    const data = snap.data();
    const windowStart = data.windowStart || now;
    const count = data.count || 0;

    if (now - windowStart > windowMs) {
      tx.set(ref, { count: 1, windowStart: now, updatedAt: now }, { merge: true });
      return true;
    }

    if (count >= limit) return false;

    tx.set(ref, { count: count + 1, updatedAt: now }, { merge: true });
    return true;
  });

  return allowed;
}

export async function sendTransactionalEmail({ to, subject, html, text }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.DELETION_FROM_EMAIL || "contact@kuroza.co.uk";
  if (!apiKey) return;

  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: "Kuroza" },
      subject,
      content: [
        { type: "text/plain", value: text || "" },
        { type: "text/html", value: html || "" }
      ]
    })
  });
}

export function genericSuccessMessage(type) {
  return `If an account is associated with that email, we have sent a ${type} confirmation link.`;
}
