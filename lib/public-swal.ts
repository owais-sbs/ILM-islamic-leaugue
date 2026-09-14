'use client';

import Swal from 'sweetalert2';

const base = Swal.mixin({
  buttonsStyling: false,
  customClass: {
    popup: 'rounded-3xl border border-ilm-navy/10 shadow-2xl font-sans',
    title: 'text-ilm-navy text-xl font-normal',
    htmlContainer: 'text-ilm-navy/65 text-sm leading-relaxed',
    confirmButton:
      'rounded-full bg-ilm-navy px-6 py-2.5 text-xs uppercase tracking-wide text-white mx-1',
  },
});

export const publicSwal = {
  sent(title: string, text: string) {
    return base.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'Thank you',
      timer: 5000,
      timerProgressBar: true,
    });
  },
  error(title: string, text?: string) {
    return base.fire({ icon: 'error', title, text, confirmButtonText: 'Close' });
  },
};
