'use client';

import { PageHeader, Card } from '@/components/admin/AdminUI';
import { mockAuthor } from '@/lib/mock-data';
import { Mail, Briefcase, GraduationCap, Building2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div>
      <PageHeader 
        title="My Profile" 
        description="Manage your professional information and credentials." 
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-4 ring-sky-50">
              <img src={mockAuthor.avatarUrl} alt={mockAuthor.fullName} className="h-full w-full object-cover" />
            </div>
            <h2 className="font-display text-xl font-semibold text-ilm-navy">
              {mockAuthor.honorific} {mockAuthor.fullName}
            </h2>
            <p className="mt-1 text-sm font-medium uppercase tracking-widest text-sky-600">
              {mockAuthor.role === 'author' ? 'Author / Murabbī' : mockAuthor.role}
            </p>
            <div className="mt-4 flex justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
              Contact & Affiliations
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                {mockAuthor.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <GraduationCap size={16} className="text-slate-400" />
                {mockAuthor.credentials}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Briefcase size={16} className="text-slate-400" />
                {mockAuthor.madhhab} Madhhab
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Editable Form (Mock) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="mb-6 font-display text-lg font-semibold text-ilm-navy">
              Profile Details
            </h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Honorific / Title
                  </label>
                  <input
                    type="text"
                    defaultValue={mockAuthor.honorific}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={mockAuthor.fullName}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Short Bio
                </label>
                <textarea
                  rows={4}
                  defaultValue={mockAuthor.bio}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Academic Credentials
                  </label>
                  <input
                    type="text"
                    defaultValue={mockAuthor.credentials}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Madhhab
                  </label>
                  <select
                    defaultValue={mockAuthor.madhhab}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ilm-navy/40"
                  >
                    <option value="Hanafi">Hanafi</option>
                    <option value="Maliki">Maliki</option>
                    <option value="Shafi'i">Shafi'i</option>
                    <option value="Hanbali">Hanbali</option>
                    <option value="None">None / General</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  className="rounded-lg bg-ilm-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-ilm-navy-light"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
