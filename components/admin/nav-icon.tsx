'use client';

import {
  LayoutDashboard,
  FileText,
  PencilLine,
  UserRound,
  HelpCircle,
  CheckCircle2,
  Tag,
  Image as ImageIcon,
  Users,
  MailQuestion,
  Mail,
  Settings,
  ScrollText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  articles: FileText,
  create: PencilLine,
  profile: UserRound,
  help: HelpCircle,
  review: CheckCircle2,
  categories: Tag,
  media: ImageIcon,
  authors: Users,
  questions: MailQuestion,
  subscribers: Mail,
  settings: Settings,
  activity: ScrollText,
};

export function NavIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = iconMap[name] ?? FileText;
  return <Icon size={size} />;
}
