'use client';

import React from 'react';
import { 
  Calendar, 
  ArrowUpRight, 
  Tag as TagIcon,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { DocumentItem } from '../types';
import { getAssetUrl } from '../utils/paths';

interface FeedViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onTagClick: (tag: string) => void;
  selectedTag: string | null;
  onClearTag: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  documents,
  onSelectDocument,
  onTagClick,
  selectedTag,
  onClearTag,
}) => {
  const getStamp = (doc: DocumentItem) => {
    if (doc.is_hoax) {
      return { text: 'Fraude', cls: 'editorial-stamp stamp-hoax' };
    }
    switch (doc.stream_category) {
      case 'OFFICIAL_MILITARY':
        return { text: 'Oficial', cls: 'editorial-stamp stamp-military' };
      case 'METAPHYSICAL_CANALIZATION':
        return { text: 'Metafísico', cls: 'editorial-stamp stamp-metaphysical' };
      case 'UNRESOLVED_FOLKLORE':
        return { text: 'Folclore', cls: 'editorial-stamp stamp-folklore' };
      default:
        return { text: 'Expediente', cls: 'editorial-stamp stamp-military' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Filter Banner */}
      {selectedTag && (
        <div className="flex items-center justify-between bg-paper-100 px-4 py-2.5 rounded-2xl border border-paper-200 font-sans text-xs">
          <div className="flex items-center space-x-2">
            <TagIcon className="h-3.5 w-3.5 text-paper-700" />
            <span className="text-paper-600">Filtrando por etiqueta:</span>
            <span className="font-mono font-bold text-paper-900 bg-paper-200 px-2 py-0.5 rounded-md">{selectedTag}</span>
          </div>
          <button
            onClick={onClearTag}
            className="text-red-700 font-semibold hover:underline"
          >
            [Restablecer Vista]
          </button>
        </div>
      )}

      {/* Modern 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc) => {
          const stamp = getStamp(doc);
          return (
            <article
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className={`p-6 bg-paper-50 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-paper-md group ${
                doc.is_hoax
                  ? 'border-red-200 bg-red-50/10'
                  : 'border-paper-200 hover:border-paper-400'
              }`}
            >
              <div>
                {/* Header Dateline & Stamp */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-paper-200 text-xs font-sans text-paper-600">
                  <span className="font-mono flex items-center gap-1 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-paper-800" />
                    {doc.publication_date || 'Fecha Desconocida'}
                  </span>
                  <span className={stamp.cls}>
                    {stamp.text}
                  </span>
                </div>

                {/* Article Headline */}
                <h3 className="font-serif text-xl font-medium leading-snug text-paper-900 group-hover:text-black mb-3">
                  {doc.title}
                </h3>

                {/* Photo Plate Thumbnail */}
                {doc.image_url && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-paper-200 bg-paper-100">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getAssetUrl(doc.image_url)}
                        alt={doc.title}
                        className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    {doc.image_caption && (
                      <p className="p-2 text-[11px] font-serif italic text-paper-700 line-clamp-1 bg-paper-150/60">
                        {doc.image_caption}
                      </p>
                    )}
                  </div>
                )}

                {/* Hoax Refutation Warning */}
                {doc.is_hoax && (
                  <div className="mb-3 p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 text-xs font-sans leading-relaxed">
                    <strong className="block uppercase font-mono text-[10px] text-red-800">Peritaje de Fraude:</strong>
                    {doc.debunk_reason}
                  </div>
                )}

                {/* Summary */}
                <p className="font-sans text-xs leading-relaxed text-paper-700 line-clamp-3 mb-4">
                  {doc.summary}
                </p>
              </div>

              {/* Byline & Tags */}
              <div className="pt-3 border-t border-paper-200">
                <div className="flex items-center justify-between text-xs font-sans text-paper-600 mb-2">
                  <span className="truncate max-w-[200px]">
                    Por: {doc.author || 'Oficial de Custodia'}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-paper-800">
                    {doc.archive_reference || 'FOIA'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick(tag);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-paper-100 border border-paper-200 text-paper-700 hover:bg-paper-900 hover:text-paper-50 font-mono transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
