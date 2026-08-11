"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandLockup, Button, Panel, TextField, Badge } from "@opero/ui";
import {
  isFirebaseConfigured,
  logout,
  sendChannelMessage,
  setPresence,
  setTyping,
  watchAuth,
  watchChannelMessages,
  getUserProfile,
} from "@opero/firebase";
import type { ChatMessage, OperoUser } from "@opero/types";

const SECTIONS = [
  "overview",
  "messages",
  "calls",
  "projects",
  "analytics",
  "directory",
  "calendar",
  "vault",
  "knowledge",
  "time",
] as const;

type Section = (typeof SECTIONS)[number];

const demoMessages: ChatMessage[] = [
  {
    id: "1",
    channelId: "general",
    senderId: "u1",
    senderName: "Maya Chen",
    text: "Q3 pipeline sync is live — Snowflake connector healthy.",
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: "2",
    channelId: "general",
    senderId: "u2",
    senderName: "Jordan Blake",
    text: "Screen share room open for the Power BI walkthrough.",
    createdAt: Date.now() - 1000 * 60 * 7,
  },
];

export default function DashboardPage() {
  const params = useSearchParams();
  const demo = params.get("demo") === "1" || !isFirebaseConfigured();
  const [section, setSection] = useState<Section>("overview");
  const [profile, setProfile] = useState<OperoUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages);
  const [draft, setDraft] = useState("");
  const [callState, setCallState] = useState<"idle" | "voice" | "video" | "screen">("idle");
  const channelId = "general";

  useEffect(() => {
    if (demo) {
      setProfile({
        uid: "demo-user",
        email: params.get("email") || "demo@opero.io",
        displayName: "Alex Rivera",
        role: "user",
        orgId: "opero-default",
        department: "Revenue Ops",
        title: "Operations Lead",
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      });
      return;
    }
    const unsub = watchAuth(async (user) => {
      if (!user) {
        window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000/auth";
        return;
      }
      const p = await getUserProfile(user.uid);
      setProfile(
        p || {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "Opero User",
          role: "user",
          orgId: "opero-default",
          createdAt: Date.now(),
          lastActiveAt: Date.now(),
        }
      );
      await setPresence(user.uid, "online");
    });
    return () => unsub();
  }, [demo, params]);

  useEffect(() => {
    if (demo) return;
    return watchChannelMessages(channelId, setMessages);
  }, [demo]);

  const stats = useMemo(
    () => [
      { label: "Unread threads", value: "12" },
      { label: "Active projects", value: "8" },
      { label: "Live connectors", value: "4" },
      { label: "Hours logged", value: "31" },
    ],
    []
  );

  async function onSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !profile) return;
    if (demo) {
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now()),
          channelId,
          senderId: profile.uid,
          senderName: profile.displayName,
          text: draft.trim(),
          createdAt: Date.now(),
        },
      ]);
      setDraft("");
      return;
    }
    await sendChannelMessage(channelId, profile.uid, profile.displayName, draft.trim());
    await setTyping(channelId, profile.uid, false);
    setDraft("");
  }

  return (
    <div className="app">
      <aside className="side">
        <BrandLockup />
        <nav>
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={`nav-item ${section === s ? "active" : ""}`}
              onClick={() => setSection(s)}
            >
              {s[0].toUpperCase() + s.slice(1)}
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
            <h1>{section === "overview" ? "Operations dashboard" : section[0].toUpperCase() + section.slice(1)}</h1>
            <div style={{ color: "var(--opero-muted)", marginTop: 4 }}>
              {profile?.displayName} · {profile?.title || "Team member"}
              {demo ? " · Demo mode" : ""}
            </div>
          </div>
          <Badge>Realtime · Firestore + RTDB</Badge>
        </div>

        {section === "overview" || section === "messages" ? (
          <>
            <div className="stat-row">
              {stats.map((s) => (
                <Panel className="stat" key={s.label}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </Panel>
              ))}
            </div>
            <div className="grid">
              <Panel className="panel">
                <h2>#general · Team messages</h2>
                <div className="messages">
                  {messages.map((m) => (
                    <div className="msg" key={m.id}>
                      <strong>{m.senderName}</strong>
                      <span>{m.text}</span>
                    </div>
                  ))}
                </div>
                <form className="composer" onSubmit={onSend}>
                  <TextField
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      if (!demo && profile) setTyping(channelId, profile.uid, true);
                    }}
                    placeholder="Message the team…"
                  />
                  <Button type="submit">Send</Button>
                </form>
              </Panel>
              <div style={{ display: "grid", gap: "1rem" }}>
                <Panel className="panel">
                  <h2>Live coordination</h2>
                  <div className="call-actions">
                    <Button onClick={() => setCallState("voice")}>Voice call</Button>
                    <Button onClick={() => setCallState("video")}>Video call</Button>
                    <Button variant="ghost" onClick={() => setCallState("screen")}>
                      Screen share
                    </Button>
                  </div>
                  <p style={{ color: "var(--opero-muted)", marginTop: "0.9rem" }}>
                    Status: {callState === "idle" ? "Ready" : `${callState} session active (WebRTC signaling via RTDB)`}
                  </p>
                </Panel>
                <Panel className="panel">
                  <h2>Connectors</h2>
                  <div className="list">
                    {[
                      ["Power BI", "Revenue cockpit"],
                      ["Snowflake", "Warehouse views"],
                      ["Dataflake", "Lake sync"],
                      ["Big Data", "Job cluster"],
                    ].map(([name, desc]) => (
                      <div className="list-item" key={name}>
                        <div>
                          <strong>{name}</strong>
                          <div style={{ color: "var(--opero-muted)", fontSize: "0.85rem" }}>{desc}</div>
                        </div>
                        <span className="pill">connected</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          </>
        ) : null}

        {section === "calls" ? (
          <Panel className="panel">
            <h2>Meetings & realtime media</h2>
            <p style={{ color: "var(--opero-muted)" }}>
              Start voice, video, or screen-share rooms. Signaling events write to
              `calls/{"{sessionId}"}/signals` on Firebase Realtime Database.
            </p>
            <div className="call-actions" style={{ marginTop: "1rem" }}>
              <Button onClick={() => setCallState("voice")}>Start voice</Button>
              <Button onClick={() => setCallState("video")}>Start video</Button>
              <Button variant="ghost" onClick={() => setCallState("screen")}>
                Share screen
              </Button>
              <Button variant="ghost" onClick={() => setCallState("idle")}>
                End
              </Button>
            </div>
          </Panel>
        ) : null}

        {section === "projects" ? (
          <Panel className="panel">
            <h2>Projects</h2>
            <div className="list">
              {[
                ["Northstar CRM cutover", "78%", "active"],
                ["Dataflake ingestion", "42%", "active"],
                ["Compliance pack Q3", "91%", "review"],
              ].map(([name, prog, status]) => (
                <div className="list-item" key={name}>
                  <div>
                    <strong>{name}</strong>
                    <div style={{ color: "var(--opero-muted)", fontSize: "0.85rem" }}>Progress {prog}</div>
                  </div>
                  <span className="pill">{status}</span>
                </div>
              ))}
            </div>
          </Panel>
        ) : null}

        {section === "analytics" ? (
          <Panel className="panel">
            <h2>Analytics surfaces</h2>
            <div className="list">
              {[
                "Power BI — Executive KPI wall",
                "Snowflake — Cohort retention SQL pads",
                "Dataflake — Bronze/Silver freshness",
                "Big Data — Spark job SLO board",
              ].map((row) => (
                <div className="list-item" key={row}>
                  <strong>{row}</strong>
                  <span className="pill">live</span>
                </div>
              ))}
            </div>
          </Panel>
        ) : null}

        {["directory", "calendar", "vault", "knowledge", "time"].includes(section) ? (
          <Panel className="panel">
            <h2>{section[0].toUpperCase() + section.slice(1)}</h2>
            <p style={{ color: "var(--opero-muted)", lineHeight: 1.55 }}>
              {section === "directory" && "Browse people, departments, and org chart nodes synced from Firestore users."}
              {section === "calendar" && "Schedule standups and join Opero rooms with one click."}
              {section === "vault" && "Secure document sharing with audit trails for enterprise files."}
              {section === "knowledge" && "Internal wiki for playbooks, SOPs, and onboarding."}
              {section === "time" && "Log hours against projects and export for finance."}
            </p>
          </Panel>
        ) : null}
      </main>
    </div>
  );
}
