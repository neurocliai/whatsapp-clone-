# Opero — Business operations Enterprise

Realtime corporate operations platform for **web**, **iOS**, and **Android**.

## Apps

| App | Path | Port | Purpose |
|---|---|---|---|
| Landing | `apps/landing` | 3000 | 3D animated marketing + auth gateway |
| User | `apps/user` | 3001 | Employee workspace |
| Admin | `apps/admin` | 3002 | Org control plane |
| Mobile | `apps/mobile` | Expo | iOS + Android (Expo) |
| Gateway | `services/gateway` | 4000 | API gateway over microservices |

## Firebase project

- Project ID: `opero-enterprise`
- Realtime Database: `https://opero-enterprise-default-rtdb.firebaseio.com`
- Auth: Email/Password + Google Sign-in
- Databases: Cloud Firestore + Realtime Database

### Register the web app (required once)

1. Open [Firebase Console](https://console.firebase.google.com/project/opero-enterprise/settings/general)
2. **Add app → Web** (nickname: `opero-web`)
3. Copy the config object into each app `.env.local` (see `.env.example`)
4. Enable **Authentication → Email/Password** and **Google**
5. Create **Firestore** (production mode) and deploy rules from `firebase/`
6. Confirm **Realtime Database** URL matches the value above

Sensitive values stay in env files (gitignored). The committed templates only include the public project id and RTDB URL you shared.

## Quick start

```bash
npm install
cp .env.example apps/landing/.env.local   # then fill Firebase keys
cp .env.example apps/user/.env.local
cp .env.example apps/admin/.env.local

npm run dev:landing   # http://localhost:3000
npm run dev:user      # http://localhost:3001
npm run dev:admin     # http://localhost:3002
npm run dev:gateway   # http://localhost:4000/health
npm run dev:mobile    # Expo QR for iOS/Android
```

Without Firebase keys, landing auth runs in **demo mode** and routes to user/admin dashboards.

## Capabilities

Messaging, voice/video/screen share, project management, Power BI, Snowflake, Dataflake, Big Data, org directory, OKRs, calendar, AI notes, document vault, announcements, automation, compliance audit logs, knowledge base, time tracking, presence, RBAC, admin console.

See `prd/opero-enterprise-platform.md`.

## Microservices

`services/gateway` · `messaging` · `presence` · `calls` · `analytics` · `projects` · `identity`

## Architecture

```
Landing (auth) ─┬─► User web app  ─┐
                └─► Admin web app ─┼─► Firebase Auth / Firestore / RTDB
Mobile (Expo) ─────────────────────┘
                      ▲
              API Gateway (:4000)
```
