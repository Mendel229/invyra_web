import AdminShell from "./AdminShell";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
