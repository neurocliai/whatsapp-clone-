import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const port = Number(process.env.GATEWAY_PORT || 4000);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const services = {
  messaging: { status: "healthy", basePath: "/api/messaging" },
  presence: { status: "healthy", basePath: "/api/presence" },
  calls: { status: "healthy", basePath: "/api/calls" },
  analytics: { status: "healthy", basePath: "/api/analytics" },
  projects: { status: "healthy", basePath: "/api/projects" },
  identity: { status: "healthy", basePath: "/api/identity" },
};

app.get("/health", (_req, res) => {
  res.json({
    service: "opero-gateway",
    project: "opero-enterprise",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://opero-enterprise-default-rtdb.firebaseio.com",
    services,
    ok: true,
  });
});

app.get("/api/messaging/channels", (_req, res) => {
  res.json([
    { id: "general", name: "general", members: 128 },
    { id: "data-ops", name: "data-ops", members: 34 },
    { id: "exec", name: "exec", members: 12 },
  ]);
});

app.get("/api/presence/:uid", (req, res) => {
  res.json({ uid: req.params.uid, status: "online", source: "rtdb" });
});

app.post("/api/calls", (req, res) => {
  const { type = "video", hostId = "unknown" } = req.body || {};
  res.status(201).json({
    id: `call_${Date.now()}`,
    type,
    hostId,
    status: "ringing",
    signalingPath: `calls/call_${Date.now()}/signals`,
  });
});

app.get("/api/analytics/connectors", (_req, res) => {
  res.json([
    { kind: "powerbi", status: "connected" },
    { kind: "snowflake", status: "connected" },
    { kind: "dataflake", status: "syncing" },
    { kind: "bigdata", status: "connected" },
  ]);
});

app.get("/api/projects", (_req, res) => {
  res.json([
    { id: "p1", name: "Northstar CRM cutover", progress: 78 },
    { id: "p2", name: "Dataflake ingestion", progress: 42 },
  ]);
});

app.get("/api/identity/roles", (_req, res) => {
  res.json(["user", "admin", "owner"]);
});

app.listen(port, () => {
  console.log(`Opero gateway listening on :${port}`);
});
