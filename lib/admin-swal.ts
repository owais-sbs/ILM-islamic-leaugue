'use client';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const base = Swal.mixin({
  buttonsStyling: false,
  customClass: {
    popup: 'rounded-3xl border border-ilm-navy/10 shadow-2xl font-sans',
    title: 'text-ilm-navy text-xl font-semibold',
    htmlContainer: 'text-ilm-navy/60 text-sm',
    confirmButton:
      'rounded-full bg-ilm-navy px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white mx-1',
    cancelButton:
      'rounded-full border border-ilm-navy/15 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ilm-navy mx-1',
    denyButton:
      'rounded-full bg-red-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white mx-1',
  },
});

export const adminSwal = {
  success(title: string, text?: string) {
    return base.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'OK',
      timer: 2200,
      timerProgressBar: true,
    });
  },
  info(title: string, text?: string) {
    return base.fire({ icon: 'info', title, text, confirmButtonText: 'OK' });
  },
  error(title: string, text?: string) {
    return base.fire({ icon: 'error', title, text, confirmButtonText: 'Close' });
  },
  confirm(title: string, text: string, confirmText = 'Confirm') {
    return base.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
    });
  },
};
