import {
  getClientIp,
  initFirebaseAdmin,
  isAllowedOrigin,
  json,
  parseBody,
  sendTransactionalEmail,
  sha256,
  verifyToken
} from "./_deletion-utils.js";

async function deleteUserOwnedData({ admin, db, uid }) {
  const userCollections = (process.env.USER_COLLECTIONS_TO_DELETE || "users")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const collectionName of userCollections) {
    const ref = db.collection(collectionName).doc(uid);
    await admin.firestore().recursiveDelete(ref);
  }

  const bucket = admin.storage().bucket();
  if (bucket && bucket.name) {
    const prefixes = [`users/${uid}/`, `${uid}/`];
    for (const prefix of prefixes) {
      try {
        const [files] = await bucket.getFiles({ prefix });
        await Promise.all(files.map((f) => f.delete().catch(() => null)));
      } catch {
        // Ignore missing bucket/prefix errors
      }
    }
  }
}

async function anonymizeUserData({ db, uid }) {
  const usersRef = db.collection("users").doc(uid);
  await usersRef.set(
    {
      displayName: "Deleted User",
      username: null,
      email: null,
      phoneNumber: null,
      photoURL: null,
      deletedAt: Date.now(),
      deletionType: "data"
    },
    { merge: true }
  );

  const dataCollections = (process.env.USER_DATA_COLLECTIONS_TO_DELETE || "user_private")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const collectionName of dataCollections) {
    const ref = db.collection(collectionName).doc(uid);
    await db.recursiveDelete(ref);
  }
}

async function processDeletionJob({ admin, db, jobId, tokenDoc }) {
  const { type, uid, email } = tokenDoc;
  const jobRef = db.collection("deletionJobs").doc(jobId);

  await jobRef.set({ status: "processing", startedAt: Date.now() }, { merge: true });

  try {
    if (type === "account") {
      await deleteUserOwnedData({ admin, db, uid });
      await admin.auth().deleteUser(uid);
    } else {
      await anonymizeUserData({ db, uid });
    }

    await db.collection("deletionAudit").add({
      uid,
      emailHash: sha256(email),
      type,
      completedAt: Date.now(),
      retained: {
        reason: "Security and compliance audit record",
        retentionDays: Number(process.env.AUDIT_RETENTION_DAYS || 180)
      }
    });

    await jobRef.set({ status: "completed", completedAt: Date.now() }, { merge: true });

    await sendTransactionalEmail({
      to: email,
      subject: type === "account" ? "Kuroza account deletion completed" : "Kuroza data deletion completed",
      text:
        type === "account"
          ? "Your Kuroza account deletion request has been completed."
          : "Your Kuroza data deletion request has been completed.",
      html:
        type === "account"
          ? "<p>Your Kuroza account deletion request has been completed.</p>"
          : "<p>Your Kuroza data deletion request has been completed.</p>"
    });
  } catch (err) {
    console.error("deletion job failed:", err);
    await jobRef.set(
      {
        status: "failed",
        failedAt: Date.now(),
        error: String(err?.message || err)
      },
      { merge: true }
    );
    throw err;
  }
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
  if (!isAllowedOrigin(event)) return json(403, { error: "Forbidden" });

  try {
    const body = parseBody(event);
    const token = String(body.token || "").trim();
    if (!token) return json(400, { error: "Missing token" });

    const payload = verifyToken(token);
    const admin = initFirebaseAdmin();
    const db = admin.firestore();

    const tokenRef = db.collection("deletionTokens").doc(payload.tid);

    const tokenDoc = await db.runTransaction(async (tx) => {
      const snap = await tx.get(tokenRef);
      if (!snap.exists) throw new Error("Invalid or expired token");
      const data = snap.data();

      if (data.used) throw new Error("Token already used");
      if (Date.now() > data.expiresAt) throw new Error("Token expired");
      if (data.tokenHash !== sha256(token)) throw new Error("Invalid token");
      if (data.uid !== payload.uid || data.email !== payload.email || data.type !== payload.type) {
        throw new Error("Token payload mismatch");
      }

      tx.set(
        tokenRef,
        {
          used: true,
          usedAt: Date.now(),
          usedIp: getClientIp(event),
          usedUserAgent: event.headers["user-agent"] || "unknown"
        },
        { merge: true }
      );

      return data;
    });

    const jobRef = await db.collection("deletionJobs").add({
      uid: tokenDoc.uid,
      email: tokenDoc.email,
      type: tokenDoc.type,
      status: "queued",
      createdAt: Date.now(),
      tokenId: payload.tid
    });

    await processDeletionJob({ admin, db, jobId: jobRef.id, tokenDoc });

    return json(200, {
      success: true,
      message: "Your deletion request has been confirmed and is now being processed."
    });
  } catch (err) {
    console.error("deletion-confirm error:", err);
    return json(400, { error: "This link is invalid or expired. Please request a new deletion link." });
  }
}
