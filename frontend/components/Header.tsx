'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  AlertTriangle, 
  Plus, 
  History,
  Layers,
  FileText,
  Moon,
  Sun
} from 'lucide-react';
import { StreamStats } from '../types';

interface HeaderProps {
  activeTab: 'timeline' | 'feed' | 'library';
  setActiveTab: (tab: 'timeline' | 'feed' | 'library') => void;
  onOpenIngest: () => void;
  stats: StreamStats | null;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenIngest,
  stats,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="w-full bg-paper-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-paper-200 dark:border-stone-800 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Dateline */}
        <div className="py-2 border-b border-paper-200/80 dark:border-stone-800/80 flex items-center justify-between text-[11px] font-sans text-paper-700 dark:text-stone-400">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-paper-900 dark:text-stone-200 font-semibold tracking-wider">VENTANA CÓSMICA</span>
            <span className="text-paper-300 dark:text-stone-700">•</span>
            <span>EDICIÓN ESPECIAL DE INVESTIGACIÓN</span>
            <span className="text-paper-300 dark:text-stone-700 hidden sm:inline">•</span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase bg-paper-150 dark:bg-stone-900 px-2 py-0.5 rounded text-paper-800 dark:text-stone-300 border border-paper-200 dark:border-stone-800">
              FOIA & NARA OPEN RECORDS
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium font-sans">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse" />
              Índice Vectorial Activo
            </span>
          </div>
        </div>

        {/* Main Header / Masthead */}
        <div className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-paper-900 dark:text-stone-100">
                Ventana Cósmica
              </h1>
              <span className="editorial-stamp stamp-military">
                DEPO // ARCHIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm font-sans text-paper-700 dark:text-stone-400 mt-1 max-w-xl">
              Plataforma periodística y base de datos semántica para el análisis de expedientes desclasificados, telemetría y fenómenos anómalos.
            </p>
          </div>

          {/* Segmented Modern Navigation Pills & Actions */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center p-1 bg-paper-150 dark:bg-stone-900 rounded-xl border border-paper-200/90 dark:border-stone-800 shadow-paper-sm">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all ${
                  activeTab === 'timeline'
                    ? 'bg-paper-50 dark:bg-stone-800 text-paper-900 dark:text-stone-100 shadow-sm border border-paper-200 dark:border-stone-700 font-semibold'
                    : 'text-paper-700 dark:text-stone-400 hover:text-paper-900 dark:hover:text-stone-200'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>Carrusel de Hitos</span>
              </button>

              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all ${
                  activeTab === 'feed'
                    ? 'bg-paper-50 dark:bg-stone-800 text-paper-900 dark:text-stone-100 shadow-sm border border-paper-200 dark:border-stone-700 font-semibold'
                    : 'text-paper-700 dark:text-stone-400 hover:text-paper-900 dark:hover:text-stone-200'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Crónica</span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all ${
                  activeTab === 'library'
                    ? 'bg-paper-50 dark:bg-stone-800 text-paper-900 dark:text-stone-100 shadow-sm border border-paper-200 dark:border-stone-700 font-semibold'
                    : 'text-paper-700 dark:text-stone-400 hover:text-paper-900 dark:hover:text-stone-200'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>4 Secciones</span>
              </button>
            </div>

            {/* Dark/Light Theme Switcher Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-paper-200 dark:border-stone-800 bg-paper-100 dark:bg-stone-900 text-paper-800 dark:text-stone-200 hover:bg-paper-150 dark:hover:bg-stone-800 transition-all shadow-paper-sm"
              title={isDarkMode ? 'Cambiar a Modo Claro (Periódico)' : 'Cambiar a Modo Oscuro (Top Secret)'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="h-4 w-4 text-stone-700" />
              )}
            </button>

            {/* Modern Ingest Button */}
            <button
              onClick={onOpenIngest}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-paper-900 dark:bg-stone-100 hover:bg-black dark:hover:bg-white text-paper-50 dark:text-stone-950 rounded-xl text-xs font-sans font-medium shadow-paper-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nueva Fuente</span>
            </button>
          </div>
        </div>

        {/* Minimalist Telemetry Ticker */}
        {stats && (
          <div className="py-2.5 border-t border-paper-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-paper-700 dark:text-stone-400">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-[10px] uppercase text-paper-500 dark:text-stone-500 font-bold tracking-wider">
                BALANCE CLASIFICADO:
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                <span>Oficial:</span>
                <strong className="text-paper-900 dark:text-stone-100 font-mono">{stats.official_military_count}</strong>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-500" />
                <span>Metafísico:</span>
                <strong className="text-paper-900 dark:text-stone-100 font-mono">{stats.metaphysical_canalization_count}</strong>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                <span>Folclore:</span>
                <strong className="text-paper-900 dark:text-stone-100 font-mono">{stats.unresolved_folklore_count}</strong>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-500" />
                <span>Fraudes Refutados:</span>
                <strong className="text-red-700 dark:text-red-400 font-mono">{stats.proven_hoax_count}</strong>
              </div>
            </div>

            <span className="text-[11px] text-paper-500 dark:text-stone-500 font-mono hidden lg:inline">
              Total Expedientes Indexados: {stats.total_documents}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
