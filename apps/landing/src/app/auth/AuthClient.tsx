"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrandLockup, Button, TextField, Panel } from "@opero/ui";
import {
  isFirebaseConfigured,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  getUserProfile,
} from "@opero/firebase";

const userUrl = process.env.NEXT_PUBLIC_USER_APP_URL || "http://localhost:3001";
const adminUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || "http://localhost:3002";

export default function AuthPage() {
  const params = useSearchParams();
  const initialMode = params.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = useMemo(() => isFirebaseConfigured(), []);

  async function redirectForUser(uid: string) {
    const profile = await getUserProfile(uid);
    const target = profile?.role === "admin" || profile?.role === "owner" ? adminUrl : userUrl;
    window.location.href = `${target}/dashboard`;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!configured) {
        const dest = email.toLowerCase().includes("admin") ? adminUrl : userUrl;
        window.location.href = `${dest}/dashboard?demo=1&email=${encodeURIComponent(email || "demo@opero.io")}`;
        return;
      }
      if (mode === "register") {
        const user = await registerWithEmail(email, password, name || email.split("@")[0]);
        await redirectForUser(user.uid);
      } else {
        const user = await loginWithEmail(email, password);
        await redirectForUser(user.uid);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError("");
    setLoading(true);
    try {
      if (!configured) {
        window.location.href = `${userUrl}/dashboard?demo=1`;
        return;
      }
      const user = await loginWithGoogle();
      await redirectForUser(user.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell auth-shell">
      <div className="noise" />
      <Panel className="auth-card">
        <BrandLockup />
        <h1>{mode === "login" ? "Welcome back" : "Create your workspace"}</h1>
        <p>
          {configured
            ? "Sign in with email or Google. Firebase Auth + Firestore profile sync."
            : "Add Firebase web keys to .env.local to enable live auth. Demo mode is available meanwhile."}
        </p>
        <form className="stack" onSubmit={onSubmit}>
          {mode === "register" ? (
            <TextField
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          ) : null}
          <TextField
            type="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <TextField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={configured}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {error ? <div className="error">{error}</div> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <div className="divider" style={{ margin: "1rem 0" }}>
          or
        </div>
        <Button variant="ghost" onClick={onGoogle} disabled={loading} style={{ width: "100%" }}>
          Continue with Google
        </Button>
        <div style={{ marginTop: "1.2rem", color: "var(--opero-muted)", fontSize: "0.92rem" }}>
          {mode === "login" ? (
            <>
              New to Opero?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                style={{ background: "none", border: 0, color: "var(--opero-teal)", cursor: "pointer" }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have access?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{ background: "none", border: 0, color: "var(--opero-teal)", cursor: "pointer" }}
              >
                Sign in
              </button>
            </>
          )}
          <div style={{ marginTop: "0.8rem" }}>
            <Link href="/">← Back to landing</Link>
          </div>
        </div>
      </Panel>
    </div>
  );
}
