import { Suspense } from "react";
import AuthPage from "./AuthClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="auth-shell">Loading…</div>}>
      <AuthPage />
    </Suspense>
  );
}
