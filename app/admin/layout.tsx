import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminLayoutRoute({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
