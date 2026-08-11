"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandLockup, Button, Panel, Badge } from "@opero/ui";
import { OPERO_FEATURES } from "@opero/types";
import { isFirebaseConfigured, logout, watchAuth, getUserProfile } from "@opero/firebase";

const TABS = [
  "overview",
  "users",
  "connectors",
  "features",
  "compliance",
  "automation",
  "announcements",
  "policies",
] as const;

type Tab = (typeof TABS)[number];

export default function AdminDashboard() {
  const params = useSearchParams();
  const demo = params.get("demo") === "1" || !isFirebaseConfigured();
  const [tab, setTab] = useState<Tab>("overview");
  const [adminName, setAdminName] = useState("Opero Admin");
  const [flags, setFlags] = useState(() =>
    Object.fromEntries(OPERO_FEATURES.map((f) => [f.key, true])) as Record<string, boolean>
  );

  useEffect(() => {
    if (demo) {
      setAdminName(params.get("email") || "admin@opero.io");
      return;
    }
    return watchAuth(async (user) => {
      if (!user) {
        window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000/auth";
        return;
      }
      const profile = await getUserProfile(user.uid);
      if (profile && profile.role !== "admin" && profile.role !== "owner") {
        window.location.href = process.env.NEXT_PUBLIC_USER_APP_URL || "http://localhost:3001/dashboard";
        return;
      }
      setAdminName(profile?.displayName || user.displayName || "Admin");
    });
  }, [demo, params]);

  return (
    <div className="app">
      <aside className="side">
        <BrandLockup />
        <div style={{ marginTop: "0.75rem" }}>
          <Badge>Admin console</Badge>
        </div>
        <nav>
          {TABS.map((t) => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: "2rem" }}>
          <Button
            variant="ghost"
            style={{ width: "100%" }}
            onClick={async () => {
              await logout();
              window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";
            }}
          >
            Sign out
          </Button>
        </div>
      </aside>

      <main className="main">
        <div className="top">
          <div>
            <h1>Enterprise control plane</h1>
            <div style={{ color: "var(--opero-muted)", marginTop: 4 }}>
              {adminName}
              {demo ? " · Demo mode" : ""}
            </div>
          </div>
          <Badge>opero-enterprise</Badge>
        </div>

        {tab === "overview" ? (
          <>
            <div className="grid-3">
              {[
                ["1,248", "Active users"],
                ["22", "Feature modules"],
                ["99.98%", "Realtime uptime"],
              ].map(([v, l]) => (
                <Panel className="panel metric" key={l}>
                  <b>{v}</b>
                  <span>{l}</span>
                </Panel>
              ))}
            </div>
            <Panel className="panel">
              <h2>Service health</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Microservice</th>
                    <th>Region</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["gateway", "us-central1", "healthy"],
                    ["messaging", "us-central1", "healthy"],
                    ["presence", "us-central1", "healthy"],
                    ["calls", "us-central1", "healthy"],
                    ["analytics", "us-central1", "syncing"],
                    ["projects", "us-central1", "healthy"],
                    ["identity", "us-central1", "healthy"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </>
        ) : null}

        {tab === "users" ? (
          <Panel className="panel">
            <h2>User lifecycle</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Alex Rivera", "user", "Revenue Ops", "online"],
                  ["Maya Chen", "user", "Data", "busy"],
                  ["Jordan Blake", "admin", "IT", "online"],
                  ["Sam Okonkwo", "user", "Finance", "away"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        ) : null}

        {tab === "connectors" ? (
          <Panel className="panel">
            <h2>Data platform connectors</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Connector</th>
                  <th>Workspace</th>
                  <th>Last sync</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Power BI", "Exec KPI", "2m ago", "connected"],
                  ["Snowflake", "ANALYTICS.WH", "5m ago", "connected"],
                  ["Dataflake", "lake-prod", "8m ago", "syncing"],
                  ["Big Data", "spark-cluster-a", "1m ago", "connected"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        ) : null}

        {tab === "features" ? (
          <Panel className="panel">
            <h2>Feature flags</h2>
            {OPERO_FEATURES.map((f) => (
              <div className="toggle" key={f.key}>
                <div>
                  <strong>{f.label}</strong>
                  <div style={{ color: "var(--opero-muted)", fontSize: "0.85rem" }}>{f.description}</div>
                </div>
                <button
                  className={`switch ${flags[f.key] ? "on" : ""}`}
                  aria-label={`Toggle ${f.label}`}
                  onClick={() => setFlags((prev) => ({ ...prev, [f.key]: !prev[f.key] }))}
                >
                  <i />
                </button>
              </div>
            ))}
          </Panel>
        ) : null}

        {tab === "compliance" ? (
          <Panel className="panel">
            <h2>Audit log</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["jordan@opero.io", "role.update", "alex@opero.io", "Just now"],
                  ["system", "connector.sync", "snowflake", "4m ago"],
                  ["maya@opero.io", "vault.share", "Q3-board.pdf", "12m ago"],
                ].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        ) : null}

        {tab === "automation" ? (
          <Panel className="panel">
            <h2>Workflow automation</h2>
            <p style={{ color: "var(--opero-muted)" }}>
              Triggers: new hire → create channels · connector error → page on-call · project blocked → notify owners.
            </p>
          </Panel>
        ) : null}

        {tab === "announcements" ? (
          <Panel className="panel">
            <h2>Company announcements</h2>
            <p style={{ color: "var(--opero-muted)" }}>
              Publish org-wide updates that fan out to user feeds and mobile push.
            </p>
          </Panel>
        ) : null}

        {tab === "policies" ? (
          <Panel className="panel">
            <h2>Security policies</h2>
            <p style={{ color: "var(--opero-muted)" }}>
              Enforce SSO domains, session TTL, screen-share recording consent, and retention for Firestore messages.
            </p>
          </Panel>
        ) : null}
      </main>
    </div>
  );
}
