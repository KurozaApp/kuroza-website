https://kuroza.netlify.app/
--
[![Netlify Status](https://api.netlify.com/api/v1/badges/32bb4780-50fd-4830-ae1c-b53d18565e68/deploy-status)](https://app.netlify.com/projects/kuroza/deploys)
## Account + Data Deletion Flow (Production)

This repo includes a production-ready deletion request/confirmation flow for Google Play compliance.

### Public URLs

- `https://kuroza.co.uk/delete-account`
- `https://kuroza.co.uk/delete-data`
- `https://kuroza.co.uk/delete-account/confirm?token=...`
- `https://kuroza.co.uk/delete-data/confirm?token=...`

Recommended **Google Play "Delete account URL"**:

- `https://kuroza.co.uk/delete-account`

### API Endpoints

- `POST /api/deletion/request`
  - body: `{ email, username?, type: "account" | "data", captchaToken? }`
  - returns generic success response (no account existence leak)

- `POST /api/deletion/confirm`
  - body: `{ token }`
  - validates signed one-time token + TTL + used state
  - enqueues and processes deletion job

### Security Controls Included

- One-time signed token with short TTL
- Hashed token at rest in Firestore
- Atomic token use-marking (single-use)
- Rate limits per IP + email hash
- Origin/referer checks for CSRF mitigation
- Optional CAPTCHA validation (`RECAPTCHA_SECRET_KEY`)
- Generic success response to avoid email enumeration
- Request/confirm/deletion event logging

### Data Deletion Behavior

- `type=account`:
  - deletes Firebase Auth user
  - recursively deletes configured user docs
  - deletes user storage prefixes (if bucket configured)
  - stores minimal audit record

- `type=data`:
  - anonymizes profile fields
  - deletes configured personal data collections
  - keeps account where policy permits

### Required Environment Variables

- `FIREBASE_SERVICE_ACCOUNT` (JSON string)
- `DELETION_TOKEN_SECRET` (strong random secret)
- `PUBLIC_BASE_URL` (e.g. `https://kuroza.co.uk`)
- `SENDGRID_API_KEY`
- `DELETION_FROM_EMAIL` (default: `contact@kuroza.co.uk`)
- `FIREBASE_STORAGE_BUCKET` (optional but recommended)
- `ALLOWED_ORIGINS` (comma-separated, optional override)
- `DELETION_TOKEN_TTL_MS` (optional, default 45m)
- `AUDIT_RETENTION_DAYS` (optional, default 180)
- `USER_COLLECTIONS_TO_DELETE` (optional, default `users`)
- `USER_DATA_COLLECTIONS_TO_DELETE` (optional, default `user_private`)
- `RECAPTCHA_SECRET_KEY` (optional, enables CAPTCHA verification)

### Deployment Steps

1. Add all environment variables in Netlify site settings.
2. Ensure Firebase service account has Auth Admin + Firestore + Storage permissions.
3. Deploy site/functions (`git push` to deployed branch).
4. Verify routes:
   - `/delete-account`
   - `/delete-data`
5. Perform E2E test:
   - submit request with test email
   - click emailed confirm link
   - verify deletion job + completion email + audit record.
