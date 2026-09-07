'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Role } from '@/lib/data';
import { useAuth } from '@/components/admin/AuthProvider';

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue>({ role: 'admin', setRole: () => {} });

/** Role comes from the signed-in Supabase profile (RLS-backed). */
export function RoleProvider({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const value = useMemo(
    () => ({
      role,
      setRole: () => {
        /* Role is managed in the database profile, not switched in the UI */
      },
    }),
    [role],
  );
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

const rolePermissions: Record<Role, {
  canPublish: boolean;
  canApprove: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
  canManageTaxonomy: boolean;
  canViewAllArticles: boolean;
  canExport: boolean;
  canViewActivity: boolean;
  canAssignQuestions: boolean;
}> = {
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
  },
};

export function usePermissions() {
  const { role } = useRole();
  return rolePermissions[role];
}

export const roleLabels: Record<Role, string> = {
  author: 'Author (Murabbī)',
  editor: 'Editor',
  admin: 'Administrator',
};
