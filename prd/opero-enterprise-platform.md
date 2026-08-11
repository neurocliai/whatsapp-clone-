# Opero — Business Operations Enterprise

## Product vision

Opero is a realtime enterprise operations platform for corporate teams — messaging, meetings, project delivery, and data/analytics connectors in one secure workspace. Tagline: **Business operations Enterprise**.

## Platforms

- Web (landing, user app, admin app)
- iOS & Android (Expo)

## Backend

- Firebase Authentication (Email/Password + Google Sign-in)
- Cloud Firestore (structured enterprise data)
- Firebase Realtime Database (presence, typing, live call signaling)
- Project: `opero-enterprise`
- RTDB: `https://opero-enterprise-default-rtdb.firebaseio.com`

## Core capabilities

1. Team messaging (channels, DMs, threads)
2. Voice calls
3. Video calls
4. Screen share
5. Project management (boards, milestones, owners)
6. Power BI embedded analytics
7. Snowflake connector views
8. Dataflake / lakehouse ingestion status
9. Big data pipeline health dashboards

## Additional features (10+)

10. Organizational directory & org chart
11. Task / OKR tracking
12. Meeting calendar & scheduling
13. AI meeting summaries
14. Document vault & secure file sharing
15. Company announcements feed
16. Workflow automation rules
17. Compliance & audit logs
18. Knowledge base / wiki
19. Time tracking
20. Presence & availability status
21. Role-based access control (RBAC)
22. Admin console (users, orgs, policies)

## Personas

- **Employee (User app):** collaborate, message, join calls, manage tasks, view analytics assigned to them.
- **Admin (Admin app):** manage org, roles, connectors, compliance, feature flags, user lifecycle.

## Acceptance criteria

- Landing page loads with branded 3D hero and clear CTA to auth.
- Auth supports email/password create+sign-in and Google Sign-in.
- Authenticated users land on role-appropriate dashboard (user vs admin).
- Messaging and presence update in realtime via Firestore/RTDB.
- Sensitive Firebase keys live only in environment files (not committed secrets).
- Microservices folders expose clear service boundaries for messaging, presence, analytics, projects, calls, identity.
