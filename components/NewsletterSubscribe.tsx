'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function NewsletterSubscribe({ className = '' }: { className?: string }) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [subError, setSubError] = useState('');
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubError('');
    setSubLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('subscribers').insert({
        email: email.trim().toLowerCase(),
        confirmed_at: new Date().toISOString(),
        source: 'website',
      });
      if (error) {
        if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
          setSubscribed(true);
          return;
        }
        setSubError(error.message);
        return;
      }
      setSubscribed(true);
    } catch {
      setSubError('Something went wrong. Please try again.');
    } finally {
      setSubLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`mx-auto mt-7 rounded-xl border border-ilm-gold/25 bg-white p-4 text-sm text-ilm-navy shadow-sm ${className}`}>
        Thank you — your first letter is on its way.
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">Your email address</label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-ilm-ink shadow-sm outline-none placeholder:text-slate-400 focus:border-ilm-gold focus:ring-2 focus:ring-ilm-gold/20"
        />
        <button
          type="submit"
          disabled={subLoading}
          className="ilm-btn-primary !min-h-[48px] !rounded-full px-6"
        >
          <Send size={14} />
          {subLoading ? '…' : 'Subscribe'}
        </button>
      </form>
      {subError && <p className="mt-3 text-sm text-rose-600">{subError}</p>}
    </div>
  );
}
