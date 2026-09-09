'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Role } from '@/lib/data';
import { useAuth } from '@/components/admin/AuthProvider';
import {
  getTempRole,
  isAdminRole,
  parseRoleFromPath,
  setTempRole,
  withRolePath,
  type AdminRole,
} from '@/lib/roles';

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  /** Prefix any `/admin/...` href with the current role segment */
  adminPath: (href: string) => string;
}

const RoleContext = createContext<RoleContextValue>({
  role: 'author',
  setRole: () => {},
  adminPath: (href) => href,
});

/**
 * Effective UI role priority:
 * 1) URL `/admin/as/{role}/...`
 * 2) sessionStorage preference
 * 3) signed-in Supabase profile role
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const { role: authRole } = useAuth();
  const pathname = usePathname() || '/admin';
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams?.toString() ? `?${searchParams.toString()}` : '';

  const pathRole = parseRoleFromPath(pathname);
  const initial =
    pathRole || getTempRole() || (isAdminRole(authRole) ? authRole : 'author');

  const [role, setRoleState] = useState<Role>(initial);

  useEffect(() => {
    if (pathRole) {
      setRoleState(pathRole);
      setTempRole(pathRole);
      return;
    }
    const temp = getTempRole();
    if (temp) {
      setRoleState(temp);
      return;
    }
    if (isAdminRole(authRole)) setRoleState(authRole);
  }, [pathRole, authRole]);

  // Keep bare `/admin/...` URLs role-prefixed so the address bar shows the portal
  useEffect(() => {
    if (!pathname.startsWith('/admin')) return;
    if (parseRoleFromPath(pathname)) return;
    const target = withRolePath(`${pathname}${search}`, role as AdminRole);
    router.replace(target);
  }, [pathname, search, role, router]);

  const setRole = useCallback(
    (newRole: Role) => {
      if (!isAdminRole(newRole)) return;
      setRoleState(newRole);
      setTempRole(newRole);
      const target = withRolePath(`${pathname}${search}`, newRole);
      router.push(target);
    },
    [pathname, search, router],
  );

  const adminPath = useCallback(
    (href: string) => withRolePath(href, role as AdminRole),
    [role],
  );

  const value = useMemo(
    () => ({
      role,
      setRole,
      adminPath,
    }),
    [role, setRole, adminPath],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

export function useAdminPath() {
  return useRole().adminPath;
}

/** Exact matrix from Developer Spec §7 */
const rolePermissions: Record<
  Role,
  {
    canPublish: boolean;
    canApprove: boolean;
    canManageSettings: boolean;
    canManageUsers: boolean;
    canManageTaxonomy: boolean;
    canViewAllArticles: boolean;
    canExport: boolean;
    canViewActivity: boolean;
    canAssignQuestions: boolean;
    questionsAssignedOnly: boolean;
  }
> = {
  author: {
    canPublish: false,
    canApprove: false,
    canManageSettings: false,
    canManageUsers: false,
    canManageTaxonomy: false,
    canViewAllArticles: false,
    canExport: false,
    canViewActivity: false,
    canAssignQuestions: false,
    questionsAssignedOnly: true,
  },
  editor: {
    canPublish: false,
    canApprove: true,
    canManageSettings: false,
    canManageUsers: false,
    canManageTaxonomy: false,
    canViewAllArticles: true,
    canExport: false,
    canViewActivity: false,
    canAssignQuestions: true,
    questionsAssignedOnly: false,
  },
  admin: {
    canPublish: true,
    canApprove: true,
    canManageSettings: true,
    canManageUsers: true,
    canManageTaxonomy: true,
    canViewAllArticles: true,
    canExport: true,
    canViewActivity: true,
    canAssignQuestions: true,
    questionsAssignedOnly: false,
  },
};

export function usePermissions() {
  const { role } = useRole();
  return rolePermissions[role] || rolePermissions.author;
}

export const roleLabels: Record<Role, string> = {
  author: 'Author (Murabbī)',
  editor: 'Editor',
  admin: 'Administrator',
};
