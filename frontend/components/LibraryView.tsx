'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  AlertOctagon,
  ArrowUpRight 
} from 'lucide-react';
import { DocumentItem } from '../types';

interface LibraryViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ documents, onSelectDocument }) => {
  const officialDocs = documents.filter((d) => d.stream_category === 'OFFICIAL_MILITARY');
  const metaphysicalDocs = documents.filter((d) => d.stream_category === 'METAPHYSICAL_CANALIZATION');
  const folkloreDocs = documents.filter((d) => d.stream_category === 'UNRESOLVED_FOLKLORE');
  const hoaxDocs = documents.filter((d) => d.stream_category === 'PROVEN_HOAX');

  const sections = [
    {
      title: 'Oficial / Militar',
      subtitle: 'Telemetría de radar, FLIR y testimonios jurados',
      badge: 'editorial-stamp stamp-military',
      badgeText: 'Oficial',
      icon: <ShieldCheck className="h-4 w-4 text-blue-600" />,
      docs: officialDocs,
    },
    {
      title: 'Metafísica & Canalización',
      subtitle: 'Contacto no físico, Ley del Uno y cosmología',
      badge: 'editorial-stamp stamp-metaphysical',
      badgeText: 'Esotérico',
      icon: <Sparkles className="h-4 w-4 text-purple-600" />,
      docs: metaphysicalDocs,
    },
    {
      title: 'Folclore no Resuelto',
      subtitle: 'Crónicas de prensa históricas sin radar oficial',
      badge: 'editorial-stamp stamp-folklore',
      badgeText: 'Folclore',
      icon: <Compass className="h-4 w-4 text-emerald-600" />,
      docs: folkloreDocs,
    },
    {
      title: 'Fraudes Desmentidos',
      subtitle: 'Montajes de maquetas y confesiones documentadas',
      badge: 'editorial-stamp stamp-hoax',
      badgeText: 'Refutado',
      icon: <AlertOctagon className="h-4 w-4 text-red-600" />,
      docs: hoaxDocs,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {sections.map((sec) => (
        <div
          key={sec.title}
          className="flex flex-col h-[780px] bg-paper-100/70 rounded-3xl border border-paper-200 p-4 shadow-paper-sm"
        >
          {/* Section Header */}
          <div className="p-3 bg-paper-50 rounded-2xl border border-paper-200/80 mb-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className={sec.badge}>
                {sec.badgeText}
              </span>
              <span className="font-mono text-xs font-semibold text-paper-700">
                {sec.docs.length} Casos
              </span>
            </div>
            <h3 className="font-serif text-base font-medium text-paper-900">
              {sec.title}
            </h3>
            <p className="font-sans text-[11px] text-paper-600 leading-snug">
              {sec.subtitle}
            </p>
          </div>

          {/* Scrollable Document Cards */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {sec.docs.length === 0 ? (
              <div className="text-center py-12 font-sans text-xs text-paper-500">
                Sin expedientes registrados en esta sección.
              </div>
            ) : (
              sec.docs.map((doc) => (
                <article
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className={`p-3.5 bg-paper-50 rounded-2xl border border-paper-200 hover:border-paper-400 cursor-pointer transition-all hover:shadow-paper-sm group ${
                    doc.is_hoax ? 'border-red-200 bg-red-50/20' : ''
                  }`}
                >
                  {doc.image_url && (
                    <div className="mb-2.5 relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-paper-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={doc.image_url}
                        alt={doc.title}
                        className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-paper-500 mb-1 flex items-center justify-between">
                    <span>{doc.publication_date || 'Fecha N/A'}</span>
                    <span className="font-semibold text-paper-800">{doc.archive_reference || 'FOIA'}</span>
                  </div>

                  <h4 className="font-serif text-sm font-medium leading-snug text-paper-900 group-hover:text-black mb-1 line-clamp-2">
                    {doc.title}
                  </h4>

                  <p className="font-sans text-[11px] text-paper-600 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
