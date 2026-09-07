'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  FileText,
  FolderTree,
  Home,
  Image as ImageIcon,
  Inbox,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Tag,
  Users,
  X,
  Bell,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { AuthProvider, useAuth } from '@/components/admin/AuthProvider';
import { RoleProvider, usePermissions, roleLabels } from '@/components/admin/RoleContext';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Dashboard',
    items: [{ label: 'Overview', href: '/admin', icon: Home }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Articles', href: '/admin/articles', icon: FileText },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree, adminOnly: true },
      { label: 'Tags', href: '/admin/tags', icon: Tag, adminOnly: true },
      { label: 'Media', href: '/admin/media', icon: ImageIcon },
    ],
  },
  {
    label: 'People',
    items: [{ label: 'Authors', href: '/admin/authors', icon: Users, adminOnly: true }],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Questions', href: '/admin/questions', icon: MessageCircle },
      { label: 'Subscribers', href: '/admin/subscribers', icon: Inbox, adminOnly: true },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
      { label: 'Activity Log', href: '/admin/activity', icon: Activity, adminOnly: true },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const perms = usePermissions();
  const { signOut, profile } = useAuth();

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0B1248] via-[#0F1657] to-[#151d6b] text-white">
      <Link href="/admin" onClick={onNavigate} className="block border-b border-white/10 px-5 py-5">
        <SiteLogo size="sm" onDark className="brightness-110" />
        <span className="mt-2 block text-[9px] font-medium uppercase tracking-[.22em] text-sky-200/70">
          Admin Panel
        </span>
      </Link>

      <nav className="admin-sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !('adminOnly' in item && item.adminOnly) || perms.canManageSettings,
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-sky-200/40">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                        isActive
                          ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10'
                          : 'text-sky-100/70 hover:bg-white/8 hover:text-white',
                      )}
                    >
                      <Icon size={17} className={isActive ? 'text-sky-300' : 'text-sky-200/50'} />
                      {item.label}
                      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-300" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <div className="mb-2 rounded-lg bg-white/5 px-3 py-2.5">
          <p className="truncate text-xs font-medium text-white">{profile?.full_name || 'Admin'}</p>
          <p className="truncate text-[10px] text-sky-200/50">{profile?.email}</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sky-100/70 transition hover:bg-white/8 hover:text-white"
        >
          <ExternalLink size={17} className="text-sky-200/50" />
          View site
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sky-100/70 transition hover:bg-rose-500/20 hover:text-rose-100"
        >
          <LogOut size={17} className="text-sky-200/50" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile, role } = useAuth();

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
        >
          <Menu size={18} />
        </button>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-ilm-navy px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-ilm-navy-light"
        >
          <Plus size={15} /> <span className="hidden sm:inline">New Article</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden rounded-lg border border-sky-100 bg-sky-50 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-ilm-navy sm:inline">
          {roleLabels[role]}
        </span>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
        >
          <Bell size={17} />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
          <img
            src={
              profile?.avatar_url ||
              'https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80'
            }
            alt=""
            className="h-7 w-7 rounded-full object-cover ring-2 ring-sky-100"
          />
          <span className="hidden text-xs font-medium text-slate-700 sm:inline">
            {profile?.full_name || 'Admin'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <SiteLogo size="sm" className="mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
        <SiteLogo size="sm" />
        <p className="text-sm text-slate-500">Please sign in to open the admin panel.</p>
        <Link
          href="/login?next=/admin"
          className="rounded-lg bg-ilm-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 overflow-hidden shadow-xl shadow-ilm-navy/10 lg:block">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-ilm-navy/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 overflow-hidden shadow-2xl lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      <div className="flex flex-1 flex-col lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RoleProvider>
        <AdminShell>{children}</AdminShell>
      </RoleProvider>
    </AuthProvider>
  );
}
