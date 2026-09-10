'use client';

import { Upload, Copy, Trash2 } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem } from './reveal';
import { images } from '@/lib/images';

const mediaItems = [
  { id: 'm1', name: 'mosque-sunrise.jpg', size: '2.4 MB', src: images.mosqueArch },
  { id: 'm2', name: 'open-quran.jpg', size: '1.1 MB', src: images.quranOpen },
  { id: 'm3', name: 'blue-mosque.jpg', size: '3.2 MB', src: images.blueMosque },
  { id: 'm4', name: 'kaaba-makkah.jpg', size: '0.8 MB', src: images.kaaba },
  { id: 'm5', name: 'mosque-interior.jpg', size: '1.7 MB', src: images.mosqueInterior },
  { id: 'm6', name: 'mosque-dome.jpg', size: '2.0 MB', src: images.mosqueDome },
];

export function MediaScreen() {
  return (
    <Reveal>
      <h2 className="text-2xl font-semibold text-ilm-navy mb-6 tracking-tight">Media Library</h2>
      <div className="border-2 border-dashed border-ilm-navy/10 rounded-2xl p-10 text-center mb-6 cursor-pointer hover:border-ilm-gold transition-colors bg-white">
        <Upload size={28} className="mx-auto text-ilm-navy/30 mb-3" />
        <p className="text-sm text-ilm-navy/50">Click or drag files to upload</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StaggerContainer className="contents">
          {mediaItems.map((media) => (
            <StaggerItem key={media.id}>
              <div className="bg-white rounded-2xl border border-ilm-navy/10 p-4 hover:border-ilm-gold hover:shadow-md transition-all">
                <div className="mb-3 h-32 w-full overflow-hidden rounded-xl">
                  <img src={media.src} alt={media.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-ilm-navy truncate">{media.name}</h4>
                    <p className="text-xs text-ilm-navy/40">{media.size}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="text-ilm-navy/30 hover:text-ilm-navy transition-colors p-1"><Copy size={15} /></button>
                    <button className="text-ilm-navy/30 hover:text-red-500 transition-colors p-1"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </Reveal>
  );
}
