import { Suspense } from "react";
import DashboardPage from "./DashboardClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading Opero…</div>}>
      <DashboardPage />
    </Suspense>
  );
}
