import { Suspense } from "react";
import AdminDashboard from "./DashboardClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading admin…</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
