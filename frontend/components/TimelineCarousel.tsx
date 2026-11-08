'use client';

import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  ArrowUpRight, 
  AlertTriangle,
  Camera,
  ShieldCheck,
  Sparkles,
  Compass,
  AlertOctagon,
  Archive
} from 'lucide-react';
import { DocumentItem } from '../types';

interface TimelineCarouselProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
}

export const TimelineCarousel: React.FC<TimelineCarouselProps> = ({
  documents,
  onSelectDocument,
}) => {
  // Sort chronologically by date
  const sortedDocs = [...documents].sort((a, b) => {
    const yearA = parseInt(a.publication_date?.substring(0, 4) || '9999', 10);
    const yearB = parseInt(b.publication_date?.substring(0, 4) || '9999', 10);
    return yearA - yearB;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIdx = currentIndex - 1;
      setCurrentIndex(newIdx);
      scrollToCard(newIdx);
    }
  };

  const handleNext = () => {
    if (currentIndex < sortedDocs.length - 1) {
      const newIdx = currentIndex + 1;
      setCurrentIndex(newIdx);
      scrollToCard(newIdx);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cards = scrollContainerRef.current.children;
      if (cards[index]) {
        (cards[index] as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  const getStamp = (doc: DocumentItem) => {
    if (doc.is_hoax) {
      return {
        text: 'Fraude Refutado',
        className: 'editorial-stamp stamp-hoax',
        icon: <AlertOctagon className="h-3 w-3 text-red-600 dark:text-red-400" />
      };
    }
    switch (doc.stream_category) {
      case 'OFFICIAL_MILITARY':
        return {
          text: 'Oficial Desclasificado',
          className: 'editorial-stamp stamp-military',
          icon: <ShieldCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
        };
      case 'METAPHYSICAL_CANALIZATION':
        return {
          text: 'Canalización Esotérica',
          className: 'editorial-stamp stamp-metaphysical',
          icon: <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
        };
      case 'UNRESOLVED_FOLKLORE':
        return {
          text: 'Misterio Histórico',
          className: 'editorial-stamp stamp-folklore',
          icon: <Compass className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        };
      default:
        return {
          text: 'Expediente',
          className: 'editorial-stamp stamp-military',
          icon: <Archive className="h-3 w-3" />
        };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Modern Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-paper-100 dark:bg-stone-900 rounded-3xl border border-paper-200/90 dark:border-stone-800 shadow-paper-sm transition-colors duration-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-paper-700 dark:text-stone-400 uppercase font-semibold mb-1">
            <span className="h-2 w-2 rounded-full bg-paper-900 dark:bg-cyan-400" />
            <span>CRONOLOGÍA VISUAL // 1897 — 2023</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-paper-900 dark:text-stone-100">
            Línea de Tiempo de los Grandes Hitos Anómalos
          </h2>
          <p className="text-xs sm:text-sm font-sans text-paper-700 dark:text-stone-400 mt-1">
            Explora cada hito histórico a través de sus fotografías de época, fuentes documentales y dictámenes periciales.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2.5 rounded-full border border-paper-300 dark:border-stone-700 bg-paper-50 dark:bg-stone-800 hover:bg-paper-150 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-paper-sm text-paper-800 dark:text-stone-200"
            aria-label="Hito Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="px-3.5 py-1 bg-paper-50 dark:bg-stone-800 rounded-full border border-paper-300 dark:border-stone-700 font-mono text-xs font-medium text-paper-800 dark:text-stone-200">
            <span>{currentIndex + 1}</span> <span className="text-paper-400 dark:text-stone-500">/</span> <span>{sortedDocs.length}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === sortedDocs.length - 1}
            className="p-2.5 rounded-full border border-paper-300 dark:border-stone-700 bg-paper-50 dark:bg-stone-800 hover:bg-paper-150 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-paper-sm text-paper-800 dark:text-stone-200"
            aria-label="Hito Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modern Interactive Year Scrubber */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center space-x-2 min-w-max px-1 py-1">
          {sortedDocs.map((doc, idx) => {
            const year = doc.publication_date?.substring(0, 4) || 'N/A';
            const isActive = idx === currentIndex;
            return (
              <button
                key={doc.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  scrollToCard(idx);
                }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-paper-900 dark:bg-stone-100 text-paper-50 dark:text-stone-950 shadow-paper-sm font-semibold scale-105'
                    : 'bg-paper-150 dark:bg-stone-900 text-paper-700 dark:text-stone-400 hover:bg-paper-200 dark:hover:bg-stone-800 border border-paper-200/80 dark:border-stone-800'
                }`}
              >
                <span>{year}</span>
                <span className="text-[10px] opacity-75 truncate max-w-[90px] font-sans">
                  {doc.entities?.craft_types?.[0] || doc.tags?.[0]?.replace('#', '') || 'Hito'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Carousel Cards Track */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scroll-smooth"
      >
        {sortedDocs.map((doc, idx) => {
          const stamp = getStamp(doc);
          const isSelected = idx === currentIndex;

          return (
            <div
              key={doc.id}
              onClick={() => {
                setCurrentIndex(idx);
                onSelectDocument(doc);
              }}
              className={`relative flex-none w-[340px] sm:w-[420px] bg-paper-50 dark:bg-stone-900 rounded-3xl border transition-all duration-300 snap-center cursor-pointer group flex flex-col justify-between overflow-hidden ${
                doc.is_hoax
                  ? 'border-red-200/80 dark:border-red-900/60 hover:border-red-400 dark:hover:border-red-700 bg-gradient-to-b from-paper-50 dark:from-stone-900 to-red-50/20 dark:to-red-950/20'
                  : 'border-paper-200 dark:border-stone-800 hover:border-paper-400 dark:hover:border-stone-700 hover:shadow-paper-lg'
              } ${isSelected ? 'ring-2 ring-paper-900 dark:ring-stone-400 ring-offset-2 dark:ring-offset-stone-950' : 'shadow-paper-sm opacity-95'}`}
            >
              <div>
                {/* PHOTO HERO SECTION */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-200 dark:bg-stone-800 border-b border-paper-200 dark:border-stone-800">
                  {doc.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doc.image_url}
                      alt={doc.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-paper-150 dark:bg-stone-900 text-paper-500 dark:text-stone-500 font-mono text-xs">
                      <Camera className="h-5 w-5 mr-1 text-paper-400" />
                      <span>Sin Imagen de Archivo</span>
                    </div>
                  )}

                  {/* Stamp Overlay Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={stamp.className}>
                      {stamp.icon}
                      {stamp.text}
                    </span>
                  </div>

                  {/* Year Tag Overlay */}
                  <div className="absolute bottom-3 right-3 bg-paper-900/80 dark:bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-paper-50 dark:text-stone-200 font-mono text-[10px] font-semibold">
                    {doc.publication_date?.substring(0, 4) || 'Archivo'}
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="p-5 space-y-3">
                  {/* Photo Caption */}
                  {doc.image_caption && (
                    <p className="text-[11px] font-serif italic text-paper-700 dark:text-stone-400 leading-snug line-clamp-2">
                      &quot;{doc.image_caption}&quot;
                    </p>
                  )}

                  {/* Headline Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-medium leading-snug text-paper-900 dark:text-stone-100 group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-2">
                    {doc.title}
                  </h3>

                  {/* Hoax Alert Banner */}
                  {doc.is_hoax && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-300 text-xs font-sans">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <p className="line-clamp-2 leading-relaxed text-[11px]">
                          <strong>Peritaje Forense:</strong> {doc.debunk_reason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Archival Reference Badge */}
                  <div className="p-2.5 bg-paper-100 dark:bg-stone-800/60 rounded-xl border border-paper-200/80 dark:border-stone-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-paper-500 dark:text-stone-400 uppercase font-bold">CÓDIGO:</span>
                    <span className="font-bold text-paper-800 dark:text-stone-200 text-[11px] truncate max-w-[210px]">
                      {doc.archive_reference || 'NARA / FOIA'}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="font-sans text-xs text-paper-700 dark:text-stone-400 leading-relaxed line-clamp-3">
                    {doc.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-paper-100/60 dark:bg-stone-800/40 border-t border-paper-200 dark:border-stone-800 flex items-center justify-between text-xs font-sans">
                <span className="text-[11px] font-medium text-paper-600 dark:text-stone-400 truncate max-w-[200px]">
                  {doc.author || 'Oficial de Custodia'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDocument(doc);
                  }}
                  className="flex items-center space-x-1 text-paper-900 dark:text-stone-100 hover:text-black dark:hover:text-cyan-400 font-semibold text-xs transition-colors"
                >
                  <span>Abrir Expediente</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
