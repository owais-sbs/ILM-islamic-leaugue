import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminLayoutRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
          Loading workspace…
        </div>
      }
    >
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}
