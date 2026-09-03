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
  LayoutGrid,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Tag,
  Users,
  X,
  ChevronDown,
  Bell,
  Plus,
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

function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const roles: Role[] = ['author', 'editor', 'admin'];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-ilm-gold/60 hover:bg-ilm-cream"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ilm-navy/10 text-[10px] font-semibold uppercase text-ilm-navy">
          {role[0]}
        </span>
        <span className="hidden sm:inline">Viewing as: {roleLabels[role]}</span>
        <span className="sm:hidden">{roleLabels[role]}</span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[.15em] text-slate-400">Switch role (demo)</p>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setOpen(false); }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition',
                role === r ? 'bg-ilm-cream text-ilm-navy font-medium' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <span className={cn('h-2 w-2 rounded-full', role === r ? 'bg-ilm-gold' : 'bg-slate-300')} />
              {roleLabels[r]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  const perms = usePermissions();

  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="block border-b border-slate-100 px-6 py-5">
        <SiteLogo size="sm" />
        <span className="mt-2 block text-[8px] uppercase tracking-[.2em] text-ilm-gold/70">Admin Panel</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => !('adminOnly' in item && item.adminOnly) || perms.canManageSettings);
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-300">{group.label}</p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                        isActive
                          ? 'bg-ilm-cream text-ilm-navy'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      )}
                    >
                      <Icon size={17} className={isActive ? 'text-ilm-gold' : 'text-slate-400'} />
                      {item.label}
                      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-ilm-gold" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
          <LogOut size={17} className="text-slate-400" />
          Back to site
        </Link>
      </div>
    </div>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden">
          <Menu size={18} />
        </button>
        <Link href="/admin/articles/new" className="flex items-center gap-2 rounded-lg bg-ilm-gold px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-ilm-gold-dark">
          <Plus size={15} /> <span className="hidden sm:inline">New Article</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <RoleSwitcher />
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50">
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
          <img src="https://images.pexels.com/photos/14819810/pexels-photo-14819810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80" alt="" className="h-7 w-7 rounded-full object-cover" />
          <span className="hidden text-xs font-medium text-slate-700 sm:inline">Admin</span>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-100 bg-white lg:block">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-100 bg-white lg:hidden">
              <button onClick={() => setSidebarOpen(false)} className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400">
                <X size={18} />
              </button>
              <SidebarContent />
            </aside>
          </>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </RoleProvider>
  );
}
