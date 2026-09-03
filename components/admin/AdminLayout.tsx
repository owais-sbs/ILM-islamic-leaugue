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
} from 'lucide-react';
import { SiteLogo } from '@/components/Logo';
import { RoleProvider, useRole, usePermissions, roleLabels } from '@/components/admin/RoleContext';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/data';

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
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visible.map((item) => {
                  const Icon = item.icon;
                  const exact = item.href === '/admin';
                  const active = exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
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
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

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
        </div>
      </div>
    </div>
  );
}

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        </div>
      </div>
    </RoleProvider>
  );
}
