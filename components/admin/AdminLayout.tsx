'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Bell,
  ChevronDown,
  FileText,
  FolderTree,
  Home,
  Image as ImageIcon,
  Inbox,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Settings,
  Tag,
  Users,
  X,
<<<<<<< HEAD
  Bell,
  Plus,
  ExternalLink,
=======
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
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
      { label: 'Articles',   href: '/admin/articles',   icon: FileText },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree, adminOnly: true },
      { label: 'Tags',       href: '/admin/tags',       icon: Tag,        adminOnly: true },
      { label: 'Media',      href: '/admin/media',      icon: ImageIcon },
    ],
  },
  {
    label: 'People',
    items: [{ label: 'Authors', href: '/admin/authors', icon: Users, adminOnly: true }],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Questions',   href: '/admin/questions',   icon: MessageCircle },
      { label: 'Subscribers', href: '/admin/subscribers', icon: Inbox, adminOnly: true },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings',      href: '/admin/settings', icon: Settings, adminOnly: true },
      { label: 'Activity Log',  href: '/admin/activity', icon: Activity, adminOnly: true },
    ],
  },
];

<<<<<<< HEAD
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
=======
/* ── Role switcher (demo) ─────────────────────── */
function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const roles: Role[] = ['author', 'editor', 'admin'];

  return (
    <div className="relative px-3 pb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/10"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ilm-gold/20 text-[10px] font-bold uppercase text-ilm-gold">
          {role[0]}
        </span>
        <span className="flex-1 truncate text-left text-white/70">{roleLabels[role]}</span>
        <ChevronDown size={13} className={cn('shrink-0 text-white/40 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute bottom-full left-3 right-3 z-50 mb-1 overflow-hidden rounded-xl border border-white/10 bg-[#0d1248] shadow-2xl">
          <p className="px-3 py-2 text-[9px] font-semibold uppercase tracking-[.2em] text-white/30">
            Switch role (demo)
          </p>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setOpen(false); }}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition',
                role === r ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', role === r ? 'bg-ilm-gold' : 'bg-white/20')} />
              {roleLabels[r]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Sidebar nav content ─────────────────────── */
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const perms    = usePermissions();

  return (
    <div className="flex h-full flex-col bg-ilm-navy">
      {/* Logo area */}
      <div className="relative flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
        <Link href="/admin" onClick={onClose}>
          <SiteLogo size="sm" onDark />
        </Link>
        <span className="absolute right-3 top-3 text-[8px] font-semibold uppercase tracking-[.2em] text-ilm-gold/50">
          Admin
        </span>
        {onClose && (
          <button onClick={onClose} className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/10">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navGroups.map((group) => {
          const visible = group.items.filter(
            (item) => !('adminOnly' in item && item.adminOnly) || perms.canManageSettings,
          );
          if (!visible.length) return null;

          return (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-[.2em] text-white/40">
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visible.map((item) => {
                  const Icon = item.icon;
<<<<<<< HEAD
                  const isActive =
                    pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
=======
                  const exact = item.href === '/admin';
                  const active = exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
<<<<<<< HEAD
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
=======
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition',
                        active
                          ? 'bg-white/15 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <Icon
                        size={16}
                        className={active ? 'text-ilm-gold' : 'text-white/60'}
                      />
                      {item.label}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-ilm-gold" />
                      )}
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

<<<<<<< HEAD
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
=======
      {/* Bottom — role switcher + back to site */}
      <div className="border-t border-white/[0.08]">
        <RoleSwitcher />
        <div className="px-3 pb-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] text-white/60 transition hover:bg-white/[0.07] hover:text-white/90"
          >
            <LogOut size={15} />
            Back to public site
          </Link>
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
function AdminShell({ children }: { children: React.ReactNode }) {
=======
/* ── Top bar ─────────────────────────────────── */
function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,22,87,0.05)] md:px-6">
      {/* Left: mobile menu + new article */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={17} />
        </button>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-1.5 rounded-lg bg-ilm-gold px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[.12em] text-white transition hover:bg-ilm-gold-dark"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">New Article</span>
        </Link>
      </div>

      {/* Right: bell + user */}
      <div className="flex items-center gap-2">
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
          title="Sign out"
        >
          <img
            src="https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80"
            alt="Admin avatar"
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="hidden sm:inline">Admin</span>
          <LogOut size={13} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}

/* ── AdminLayout (exported) ──────────────────── */
export function AdminLayout({ children }: { children: React.ReactNode }) {
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, user } = useAuth();

<<<<<<< HEAD
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <SiteLogo size="sm" className="mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading workspace…</p>
=======
  return (
    <RoleProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* Desktop sidebar — fixed */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar — drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden">
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
>>>>>>> 03a3145bf8aa2b0217bde3a2111ce6e5470555b0
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
