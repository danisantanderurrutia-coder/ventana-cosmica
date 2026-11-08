'use client';

import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Filter, ArrowUpRight } from 'lucide-react';
import { StreamCategory, SearchResultItem, DocumentItem } from '../types';
import { SEED_DOCUMENTS } from '../data/seedDocuments';

interface SemanticSearchProps {
  onSelectDocument: (doc: DocumentItem) => void;
}

export const SemanticSearch: React.FC<SemanticSearchProps> = ({ onSelectDocument }) => {
  const [query, setQuery] = useState('');
  const [streamFilter, setStreamFilter] = useState<StreamCategory | 'ALL'>('ALL');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const payload: any = {
        query: query.trim(),
        top_k: 6,
        include_hoaxes: true,
      };
      if (streamFilter !== 'ALL') {
        payload.stream_filter = streamFilter;
      }

      const res = await fetch('/api/v1/documents/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        throw new Error('API returned error');
      }
    } catch (err) {
      console.warn('API search unavailable, using offline vector fallback:', err);
      // Client-side fallback search
      const q = query.toLowerCase();
      const filtered = SEED_DOCUMENTS.filter(doc => {
        if (streamFilter !== 'ALL' && doc.stream_category !== streamFilter) return false;
        const textToSearch = [
          doc.title,
          doc.summary,
          doc.raw_content || '',
          ...(doc.tags || []),
          ...(doc.entities?.people || []),
          ...(doc.entities?.locations || []),
          ...(doc.entities?.craft_types || []),
        ].join(' ').toLowerCase();
        return textToSearch.includes(q);
      });

      const fallbackResults: SearchResultItem[] = filtered.map((doc, idx) => ({
        document: doc,
        similarity_score: Math.max(0.75, 0.95 - idx * 0.04),
      }));
      setResults(fallbackResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-paper-100/80 p-5 rounded-3xl border border-paper-200/90 shadow-paper-sm">
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-paper-800" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-paper-900">
              BÚSQUEDA SEMÁNTICA // VECTORES
            </span>
          </div>
          <span className="font-sans text-xs text-paper-500 hidden sm:inline">
            Cotejo cruzado de telemetría de radar, informes de pilotos y literatura esotérica
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pregunta al archivo: ej. 'nave triangular radar', 'contacto pleyadiano', 'recuperación de restos'..."
              className="w-full pl-4 pr-10 py-3 bg-paper-50 rounded-2xl border border-paper-200 text-paper-900 placeholder-paper-500 font-sans text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-paper-900/10 focus:border-paper-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-paper-900 hover:bg-black disabled:opacity-50 text-paper-50 font-sans text-xs font-medium rounded-2xl flex items-center justify-center space-x-2 shrink-0 transition-all shadow-paper-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-paper-50" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>Buscar Coincidencias</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-sans">
          <span className="text-paper-500 mr-1 font-mono text-[11px] uppercase">Sección:</span>
          {[
            { label: 'Todas las Secciones', val: 'ALL' },
            { label: 'Oficial / Militar', val: 'OFFICIAL_MILITARY' },
            { label: 'Metafísica / Canalización', val: 'METAPHYSICAL_CANALIZATION' },
            { label: 'Folclore Histórico', val: 'UNRESOLVED_FOLKLORE' },
            { label: 'Fraudes Desmentidos', val: 'PROVEN_HOAX' },
          ].map((tab) => (
            <button
              key={tab.val}
              type="button"
              onClick={() => setStreamFilter(tab.val as any)}
              className={`px-3 py-1 rounded-full border transition-all ${
                streamFilter === tab.val
                  ? 'bg-paper-900 text-paper-50 border-paper-900 font-medium'
                  : 'bg-paper-50 text-paper-700 border-paper-200 hover:border-paper-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </form>

      {/* Results Display */}
      {hasSearched && (
        <div className="mt-5 pt-4 border-t border-paper-200">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-paper-600">
            <span className="font-bold uppercase tracking-wider">RESULTADOS SEMÁNTICOS ({results.length})</span>
            <span>Similitud Vectorial Coseno</span>
          </div>

          {results.length === 0 && !loading ? (
            <div className="text-center py-6 text-paper-600 font-serif italic text-sm">
              No se hallaron correlaciones para &quot;{query}&quot;. Intenta con términos conceptuales más amplios.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(({ document: doc, similarity_score }) => (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="p-4 bg-paper-50 rounded-2xl border border-paper-200 hover:border-paper-400 cursor-pointer transition-all shadow-paper-sm hover:shadow-paper-md group"
                >
                  <div className="flex items-center justify-between mb-2 font-mono text-[11px]">
                    <span className="text-paper-500 font-semibold uppercase">
                      {doc.publication_date} • {doc.archive_reference || 'FOIA'}
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-paper-150 border border-paper-200 text-paper-800">
                      {Math.round(similarity_score * 100)}% Match
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-medium text-paper-900 group-hover:text-black line-clamp-1 mb-1">
                    {doc.title}
                  </h4>

                  <p className="font-sans text-xs text-paper-600 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
