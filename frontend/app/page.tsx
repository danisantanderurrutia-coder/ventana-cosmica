'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { TimelineCarousel } from '../components/TimelineCarousel';
import { FeedView } from '../components/FeedView';
import { LibraryView } from '../components/LibraryView';
import { SemanticSearch } from '../components/SemanticSearch';
import { SourceDetailModal } from '../components/SourceDetailModal';
import { IngestionModal } from '../components/IngestionModal';
import { DocumentItem, StreamStats } from '../types';
import { SEED_DOCUMENTS } from '../data/seedDocuments';

const computeStats = (docs: DocumentItem[]): StreamStats => ({
  total_documents: docs.length,
  official_military_count: docs.filter(d => d.stream_category === 'OFFICIAL_MILITARY').length,
  metaphysical_canalization_count: docs.filter(d => d.stream_category === 'METAPHYSICAL_CANALIZATION').length,
  unresolved_folklore_count: docs.filter(d => d.stream_category === 'UNRESOLVED_FOLKLORE').length,
  proven_hoax_count: docs.filter(d => d.stream_category === 'PROVEN_HOAX').length,
  top_tags: [
    { tag: '#Nimitz', count: 1 },
    { tag: '#Pentagon', count: 1 },
    { tag: '#FLIR', count: 1 },
    { tag: '#Declassified', count: 2 },
    { tag: '#Roswell', count: 1 },
    { tag: '#LawOfOne', count: 1 },
    { tag: '#Ummo', count: 1 },
  ],
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'feed' | 'library'>('timeline');
  const [documents, setDocuments] = useState<DocumentItem[]>(SEED_DOCUMENTS);
  const [stats, setStats] = useState<StreamStats | null>(computeStats(SEED_DOCUMENTS));
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Dark / Light theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cosmic_theme');
    if (saved === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (saved === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('cosmic_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('cosmic_theme', 'light');
      }
      return next;
    });
  };

  // Fetch Feed & Stats
  const fetchData = useCallback(async () => {
    try {
      const feedUrl = selectedTag
        ? `/api/v1/documents/feed?limit=100&tag=${encodeURIComponent(selectedTag)}`
        : '/api/v1/documents/feed?limit=100';
      
      const [feedRes, statsRes] = await Promise.all([
        fetch(feedUrl),
        fetch('/api/v1/documents/analytics/stats'),
      ]);

      if (feedRes.ok) {
        const feedData = await feedRes.json();
        setDocuments(feedData);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.warn('API connection pending or offline. Using local seed state.', err);
      if (selectedTag) {
        setDocuments(SEED_DOCUMENTS.filter(d => d.tags?.includes(selectedTag)));
      } else {
        setDocuments(SEED_DOCUMENTS);
      }
      setStats(computeStats(SEED_DOCUMENTS));
    } finally {
      setLoading(false);
    }
  }, [selectedTag]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleIngestSuccess = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    fetchData(); // Refresh stats
    setSelectedDoc(newDoc); // Open detail view of new ingested doc
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setActiveTab('feed');
  };

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-stone-950 flex flex-col font-sans text-paper-900 dark:text-stone-100 selection:bg-paper-200 dark:selection:bg-stone-800 transition-colors duration-200">
      {/* Modern Header with Theme Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenIngest={() => setIsIngestOpen(true)}
        stats={stats}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Semantic Vector Cross-Stream Query Bar */}
        <SemanticSearch onSelectDocument={(doc) => setSelectedDoc(doc)} />

        {/* View Selection */}
        {activeTab === 'timeline' && (
          <TimelineCarousel
            documents={documents}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
          />
        )}

        {activeTab === 'feed' && (
          <FeedView
            documents={documents}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
            onTagClick={handleTagClick}
            selectedTag={selectedTag}
            onClearTag={() => setSelectedTag(null)}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            documents={documents}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
          />
        )}
      </main>

      {/* Modern Editorial Footer */}
      <footer className="border-t border-paper-200 dark:border-stone-800 bg-paper-100/60 dark:bg-stone-900/40 py-8 text-xs text-paper-600 dark:text-stone-500 font-sans transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="font-serif font-medium text-sm text-paper-900 dark:text-stone-200">Ventana Cósmica</span>
              <span className="font-mono text-[10px] uppercase bg-paper-200 dark:bg-stone-800 px-1.5 py-0.5 rounded text-paper-700 dark:text-stone-400">v1.3</span>
            </div>
            <p className="text-[11px] text-paper-500 dark:text-stone-500">
              Red de periodismo de investigación y cotejo de registros desclasificados (1897 — 2023).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-paper-500 dark:text-stone-500 font-mono">
            <span>THE BLACK VAULT</span>
            <span>•</span>
            <span>UK NATIONAL ARCHIVES (DEFE 24)</span>
            <span>•</span>
            <span>CIA CREST</span>
            <span>•</span>
            <span>NARA RG 341</span>
          </div>
        </div>
      </footer>

      {/* Longform Dossier Modal */}
      <SourceDetailModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onTagClick={handleTagClick}
      />

      {/* Ingestion Modal */}
      <IngestionModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onIngestSuccess={handleIngestSuccess}
      />
    </div>
  );
}
