'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Role } from '@/lib/data';
import { useAuth } from '@/components/admin/AuthProvider';

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue>({ role: 'author', setRole: () => {} });

/**
 * Role comes ONLY from the signed-in Supabase profile.
 * PDF §7: permissions must be enforced in UI and RLS — never trust a client "view as" switch.
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const value = useMemo(
    () => ({
      role: (role as Role) || 'author',
      setRole: () => {
        /* Role changes happen in DB via Admin → Authors, not in the UI switcher */
      },
    }),
    [role],
  );
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

/** Exact matrix from Developer Spec §7 / attached screenshot */
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
  questionsAssignedOnly: boolean;
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
    questionsAssignedOnly: true,
  },
  editor: {
    canPublish: false, // PDF: Editor cannot publish — Admin has final authority
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
