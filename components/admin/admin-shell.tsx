'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bell, ChevronLeft, ChevronRight, ExternalLink, LogOut, Plus } from 'lucide-react';
import { navConfig, roleLabels, roleUsers, type Article, type Role } from '@/lib/admin-data';
import { clearAdminRole, readAdminRole } from '@/lib/admin-session';
import { canPublish, emptyArticle, useIlm } from '@/lib/ilm-store';
import { tryCreateClient } from '@/lib/supabase/client';
import { AdminBrand } from '@/components/admin/admin-brand';
import { NavIcon } from '@/components/admin/nav-icon';
import { RoleBadge } from '@/components/admin/status-pill';
import { DashboardScreen } from '@/components/admin/dashboard-screen';
import { ArticleTable } from '@/components/admin/article-list';
import { ArticleEditor } from '@/components/admin/article-editor';
import { ArticlePreview } from '@/components/admin/article-preview';
import { ProfileScreen } from '@/components/admin/profile-screen';
import { HelpScreen } from '@/components/admin/help-screen';
import { ReviewQueue } from '@/components/admin/review-queue';
import { CategoriesScreen } from '@/components/admin/categories-screen';
import { AuthorsScreen } from '@/components/admin/authors-screen';
import { MediaScreen } from '@/components/admin/media-screen';
import { QuestionsScreen } from '@/components/admin/questions-screen';
import { SubscribersScreen } from '@/components/admin/subscribers-screen';
import { SettingsScreen } from '@/components/admin/settings-screen';
import { ActivityLogScreen } from '@/components/admin/activity-log-screen';
import { cn } from '@/lib/utils';

const titles: Record<string, string> = {
  dashboard: 'Dashboard',
  'my-articles': 'My Articles',
  'create-article': 'Create Article',
  'my-profile': 'My Profile',
  help: 'Help',
  'review-queue': 'Review Queue',
  'categories-tags': 'Categories & Tags',
  articles: 'Articles',
  authors: 'Authors',
  media: 'Media',
  questions: 'Questions',
  subscribers: 'Subscribers',
  settings: 'Settings',
  'activity-log': 'Activity Log',
};

type Screen = 'tab' | 'edit' | 'preview';

export function AdminShell() {
  const router = useRouter();
  const { articles, notices, saveArticle, approveArticle, returnArticle, publishArticle, unpublishArticle, markNoticeRead } = useIlm();
  const [role, setRole] = useState<Role | null>(null);
  const [tab, setTab] = useState('dashboard');
  const [screen, setScreen] = useState<Screen>('tab');
  const [active, setActive] = useState<Article | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    const stored = readAdminRole();
    if (!stored) {
      router.replace('/login');
      return;
    }
    setRole(stored);
  }, [router]);

  const user = role ? roleUsers[role] : null;
  const groups = role ? navConfig[role] : [];

  const myNotices = useMemo(() => {
    if (!role || !user) return [];
    return notices.filter((n) => n.role === role || n.role === 'all' || (n.role === 'author' && n.authorName === user.name));
  }, [notices, role, user]);

  const unread = myNotices.filter((n) => !n.read).length;

  const visibleArticles = useMemo(() => {
    if (!role || !user) return [];
    if (role === 'author') return articles.filter((a) => a.author === user.name);
    return articles;
  }, [articles, role, user]);

  const myArticles = useMemo(() => {
    if (!user) return [];
    return articles.filter((a) => a.author === user.name);
  }, [articles, user]);

  const ping = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(''), 3200);
  };

  const logout = async () => {
    const supabase = tryCreateClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        /* ignore */
      }
    }
    clearAdminRole();
    router.push('/login');
  };

  const openEdit = (article: Article) => {
    setActive(article);
    setScreen('edit');
  };
  const openPreview = (article: Article) => {
    setActive(article);
    setScreen('preview');
  };
  const goCreate = () => {
    if (!role) return;
    setActive(emptyArticle(role));
    setScreen('edit');
    setTab('create-article');
  };
  const backToList = () => {
    setScreen('tab');
    setActive(null);
    if (tab === 'create-article') setTab(role === 'author' ? 'my-articles' : 'articles');
  };

  if (!role || !user) {
    return <div className="grid min-h-screen place-items-center bg-ilm-cream text-ilm-navy/40">Loading workspace…</div>;
  }

  const renderTab = () => {
    switch (tab) {
      case 'dashboard':
        return <DashboardScreen role={role} articles={articles} onOpen={openPreview} />;
      case 'my-articles':
        return <ArticleTable articles={myArticles} role={role} userName={user.name} title="My Articles" onPreview={openPreview} onEdit={openEdit} />;
      case 'articles':
        return <ArticleTable articles={visibleArticles} role={role} userName={user.name} title="Articles" onPreview={openPreview} onEdit={openEdit} />;
      case 'create-article':
        return null;
      case 'my-profile':
        return <ProfileScreen role={role} />;
      case 'help':
        return <HelpScreen />;
      case 'review-queue':
        return (
          <ReviewQueue
            articles={articles}
            role={role}
            onPreview={openPreview}
            onEdit={openEdit}
            onApprove={(a) => {
              approveArticle(a.id, user.name);
              ping(`Approved. Ready for you to publish — or use Approve & Publish next time.`);
            }}
            onApproveAndPublish={(a) => {
              publishArticle(a.id, user.name);
              ping(`Published. “${a.title}” is live on the public website cards.`);
            }}
            onReturn={(a, notes) => {
              returnArticle(a.id, user.name, notes);
              ping(`Rejected. Returned to ${a.author} with notes.`);
            }}
            onPublish={(a) => {
              publishArticle(a.id, user.name);
              ping(`Published. “${a.title}” is now on the public website.`);
            }}
          />
        );
      case 'categories-tags':
        return <CategoriesScreen />;
      case 'authors':
        return <AuthorsScreen />;
      case 'media':
        return <MediaScreen />;
      case 'questions':
        return <QuestionsScreen assignedOnly={role === 'author'} assignee={user.name} />;
      case 'subscribers':
        return <SubscribersScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'activity-log':
        return <ActivityLogScreen />;
      default:
        return <DashboardScreen role={role} articles={articles} onOpen={openPreview} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-ilm-cream">
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: collapsed ? 84 : 268 }}
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        className="sticky top-0 flex h-screen shrink-0 flex-col bg-ilm-navy-deep text-white"
      >
        <div className="flex items-center justify-between px-4 py-6">
          <AdminBrand collapsed={collapsed} />
          <button onClick={() => setCollapsed((v) => !v)} className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/10" aria-label="Collapse sidebar">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {groups.map((group) => (
            <div key={group.label || 'main'} className="mb-4">
              {group.label && !collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">{group.label}</p>
              )}
              {group.items.map((item) => {
                const isActive = tab === item.key && screen === 'tab';
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setTab(item.key);
                      setScreen('tab');
                      setActive(null);
                      if (item.key === 'create-article') goCreate();
                    }}
                    className={cn(
                      'mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors',
                      isActive ? 'bg-ilm-gold/15 text-ilm-gold-light' : 'text-white/60 hover:bg-white/8 hover:text-white',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    <NavIcon name={item.icon} size={18} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'mb-2 flex w-full items-center gap-3 rounded-xl bg-ilm-gold/15 px-3 py-2.5 text-[13px] font-semibold text-ilm-gold-light transition hover:bg-ilm-gold/25',
              collapsed && 'justify-center px-0',
            )}
            title="Visit main site"
          >
            <ExternalLink size={16} />
            {!collapsed && 'Visit main site'}
          </a>
          <div className={cn('flex items-center gap-3 rounded-2xl bg-white/5 p-3', collapsed && 'justify-center p-2')}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ilm-gold/20 font-serif text-xs text-ilm-gold-light">{user.initials}</div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <RoleBadge role={role} />
              </div>
            )}
          </div>
          <button onClick={logout} className={cn('mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-white/45 hover:text-red-300', collapsed && 'justify-center')}>
            <LogOut size={16} />
            {!collapsed && 'Log out'}
          </button>
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-ilm-navy/8 bg-ilm-cream/90 px-6 py-4 backdrop-blur">
          <div>
            <h1 className="text-lg font-semibold text-ilm-navy">
              {screen === 'preview' ? 'Preview' : screen === 'edit' ? (active?.title ? 'Edit article' : 'Create article') : titles[tab] ?? 'Dashboard'}
            </h1>
            <p className="text-xs text-ilm-navy/40">{roleLabels[role]} portal · UI simulation</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goCreate} className="inline-flex items-center gap-1.5 rounded-full bg-ilm-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
              <Plus size={14} /> New Article
            </button>
            <div className="relative">
              <button onClick={() => setBellOpen((v) => !v)} className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-ilm-navy/60 shadow-sm">
                <Bell size={16} />
                {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ilm-gold" />}
              </button>
              {bellOpen && (
                <div className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-ilm-navy/8 bg-white p-3 shadow-xl">
                  {myNotices.length === 0 && <p className="px-2 py-4 text-center text-xs text-ilm-navy/40">No messages yet.</p>}
                  {myNotices.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNoticeRead(n.id)}
                      className={cn('w-full rounded-xl px-3 py-2 text-left hover:bg-ilm-cream', !n.read && 'bg-ilm-cream/70')}
                    >
                      <p className="text-sm font-semibold text-ilm-navy">{n.title}</p>
                      <p className="text-xs text-ilm-navy/50">{n.body}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setUserOpen((v) => !v)} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 shadow-sm">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ilm-navy font-serif text-[11px] text-ilm-gold-light">{user.initials}</span>
                <RoleBadge role={role} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-12 z-30 w-44 rounded-2xl border border-ilm-navy/8 bg-white p-2 shadow-xl">
                  <button onClick={() => { setTab('my-profile'); setScreen('tab'); setUserOpen(false); }} className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-ilm-cream">My profile</button>
                  <button onClick={logout} className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {flash && (
          <div className="mx-6 mt-4 rounded-2xl border border-ilm-gold/30 bg-ilm-gold/10 px-4 py-3 text-sm text-ilm-navy">{flash}</div>
        )}

        <main className="flex-1 px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${tab}-${screen}-${active?.id ?? 'none'}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {screen === 'preview' && active && (
                <div>
                  <button onClick={backToList} className="mb-5 inline-flex items-center gap-2 text-sm text-ilm-navy/50 hover:text-ilm-navy">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <div className="mb-5 flex flex-wrap gap-2">
                    <button onClick={() => openEdit(active)} className="rounded-full bg-ilm-navy px-4 py-2 text-xs font-bold uppercase text-white">Edit</button>
                    {canPublish(role) && active.status === 'approved' && (
                      <button
                        onClick={() => {
                          publishArticle(active.id, user.name);
                          ping(`Published. “${active.title}” is live on the site.`);
                          backToList();
                        }}
                        className="rounded-full bg-ilm-gold px-4 py-2 text-xs font-bold uppercase text-ilm-navy-deep"
                      >
                        Publish to website
                      </button>
                    )}
                    {canPublish(role) && active.status === 'published' && (
                      <button
                        onClick={() => {
                          unpublishArticle(active.id, user.name);
                          ping('Unpublished. Removed from the public site.');
                          backToList();
                        }}
                        className="rounded-full border border-ilm-navy/15 px-4 py-2 text-xs font-bold uppercase text-ilm-navy"
                      >
                        Unpublish
                      </button>
                    )}
                  </div>
                  <ArticlePreview article={articles.find((a) => a.id === active.id) ?? active} showStatus />
                </div>
              )}
              {screen === 'edit' && active && (
                <ArticleEditor
                  article={articles.find((a) => a.id === active.id) ?? active}
                  role={role}
                  onBack={backToList}
                  onPreview={openPreview}
                  onSave={(a, submit) => {
                    saveArticle(a, user.name, submit);
                    ping(submit ? 'Submitted. The editor will review this article.' : 'Draft saved (revision snapshot created).');
                    if (submit) backToList();
                  }}
                  onPublish={(a) => {
                    saveArticle(a, user.name, false);
                    publishArticle(a.id, user.name);
                    ping(`Published. “${a.title}” is now on the public website.`);
                    backToList();
                  }}
                />
              )}
              {screen === 'tab' && tab !== 'create-article' && renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
