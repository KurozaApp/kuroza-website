import crypto from "node:crypto";
import {
  genericSuccessMessage,
  getClientIp,
  initFirebaseAdmin,
  isAllowedOrigin,
  isValidEmail,
  json,
  parseBody,
  rateLimit,
  sendTransactionalEmail,
  sha256,
  signToken,
  verifyCaptcha
} from "./_deletion-utils.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
  if (!isAllowedOrigin(event)) return json(403, { error: "Forbidden" });

  try {
    const body = parseBody(event);
    const email = String(body.email || "").trim().toLowerCase();
    const username = String(body.username || "").trim();
    const type = body.type === "data" ? "data" : body.type === "account" ? "account" : null;
    const captchaToken = body.captchaToken;
    const userAgent = event.headers["user-agent"] || "unknown";
    const ip = getClientIp(event);

    if (!type) return json(400, { error: "Invalid request type" });
    if (!isValidEmail(email)) return json(400, { error: "Please enter a valid email address." });

    const admin = initFirebaseAdmin();
    const db = admin.firestore();

    const ipAllowed = await rateLimit({ db, key: `ip:${ip}`, limit: 10, windowMs: 60 * 60 * 1000 });
    const emailAllowed = await rateLimit({ db, key: `email:${sha256(email)}`, limit: 5, windowMs: 60 * 60 * 1000 });
    if (!ipAllowed || !emailAllowed) return json(429, { error: "Too many requests. Please try again later." });

    const captchaOk = await verifyCaptcha(captchaToken, ip);
    if (!captchaOk) return json(400, { error: "Captcha verification failed. Please try again." });

    let userRecord = null;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (err) {
      if (err.code !== "auth/user-not-found") throw err;
    }

    await db.collection("deletionEvents").add({
      action: "request",
      type,
      emailHash: sha256(email),
      existsInAuth: Boolean(userRecord),
      username: username || null,
      ip,
      userAgent,
      createdAt: Date.now()
    });

    if (userRecord) {
      const tokenId = crypto.randomUUID();
      const expiresAt = Date.now() + (Number(process.env.DELETION_TOKEN_TTL_MS) || 45 * 60 * 1000);
      const payload = {
        tid: tokenId,
        uid: userRecord.uid,
        email,
        type,
        exp: expiresAt
      };

      const token = signToken(payload);
      const tokenHash = sha256(token);

      await db.collection("deletionTokens").doc(tokenId).set({
        tokenHash,
        uid: userRecord.uid,
        email,
        type,
        expiresAt,
        used: false,
        createdAt: Date.now(),
        requesterIp: ip,
        requesterUserAgent: userAgent,
        username: username || null
      });

      const baseUrl = process.env.PUBLIC_BASE_URL || "https://kuroza.co.uk";
      const confirmPath = type === "account" ? "/delete-account/confirm" : "/delete-data/confirm";
      const confirmUrl = `${baseUrl}${confirmPath}?token=${encodeURIComponent(token)}`;

      const subject = type === "account" ? "Confirm your Kuroza account deletion" : "Confirm your Kuroza data deletion";
      const actionLabel = type === "account" ? "account deletion" : "data deletion";

      await sendTransactionalEmail({
        to: email,
        subject,
        text: `We received a request for ${actionLabel}. Confirm it here: ${confirmUrl}\n\nThis link expires in 45 minutes and can be used once.`,
        html: `
          <p>We received a request for <strong>${actionLabel}</strong> on Kuroza.</p>
          <p><a href="${confirmUrl}">Confirm ${actionLabel}</a></p>
          <p>This link expires in 45 minutes and can be used once.</p>
          <p>If you did not request this, you can ignore this email.</p>
        `
      });
    }

    return json(200, { success: true, message: genericSuccessMessage(type) });
  } catch (err) {
    console.error("deletion-request error:", err);
    return json(500, { error: "Unable to process request right now. Please try again." });
  }
}
