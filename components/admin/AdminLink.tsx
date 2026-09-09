'use client';

import Link, { type LinkProps } from 'next/link';
import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { useAdminPath } from '@/components/admin/RoleContext';

type Props = Omit<LinkProps, 'href'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    href: string;
    children: ReactNode;
  };

/** Link that keeps `/admin/as/{role}/...` in the URL when navigating the portal. */
export function AdminLink({ href, children, ...rest }: Props) {
  const adminPath = useAdminPath();
  const resolved = href.startsWith('/admin') ? adminPath(href) : href;
  return (
    <Link href={resolved} {...rest}>
      {children}
    </Link>
  );
}
