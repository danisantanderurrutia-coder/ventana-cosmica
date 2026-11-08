'use client';

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  User, 
  Archive, 
  Layers, 
  FileCheck2, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Compass,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { DocumentItem } from '../types';

interface SourceDetailModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onTagClick: (tag: string) => void;
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  document: doc,
  onClose,
  onTagClick,
}) => {
  const [showRedactions, setShowRedactions] = useState(false);

  if (!doc) return null;

  const getStamp = () => {
    if (doc.is_hoax) {
      return {
        text: 'Fraude Forense Comprobado',
        className: 'editorial-stamp stamp-hoax',
        icon: <AlertOctagon className="h-3 w-3 text-red-600 dark:text-red-400" />
      };
    }
    switch (doc.stream_category) {
      case 'OFFICIAL_MILITARY':
        return {
          text: 'Documento Militar Desclasificado // FOIA',
          className: 'editorial-stamp stamp-military',
          icon: <ShieldCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
        };
      case 'METAPHYSICAL_CANALIZATION':
        return {
          text: 'Archivo Esotérico & Canalización',
          className: 'editorial-stamp stamp-metaphysical',
          icon: <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
        };
      case 'UNRESOLVED_FOLKLORE':
        return {
          text: 'Misterio Histórico no Resuelto',
          className: 'editorial-stamp stamp-folklore',
          icon: <Compass className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        };
      default:
        return {
          text: 'Expediente Clasificado',
          className: 'editorial-stamp stamp-military',
          icon: <Archive className="h-3 w-3" />
        };
    }
  };

  const stamp = getStamp();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-paper-900/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-paper-50 dark:bg-stone-900 rounded-3xl border border-paper-300 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden text-paper-900 dark:text-stone-100 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Modal Header Bar */}
        <div className="bg-paper-100/80 dark:bg-stone-950/80 px-6 py-3 border-b border-paper-200 dark:border-stone-800 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-paper-900 dark:text-stone-100 font-bold bg-paper-200/80 dark:bg-stone-800 px-2.5 py-1 rounded-lg">
              {doc.case_file_number || `EXP-${doc.id.substring(4, 10).toUpperCase()}`}
            </span>
            <span className="text-paper-600 dark:text-stone-400 hidden sm:inline text-[11px]">
              {doc.classification_level || 'DESCLASIFICADO BAJO ACTA FOIA'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRedactions(!showRedactions)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-paper-300 dark:border-stone-700 bg-paper-50 dark:bg-stone-800 hover:bg-paper-150 dark:hover:bg-stone-700 text-xs font-sans font-medium transition-colors"
            >
              {showRedactions ? <EyeOff className="h-3.5 w-3.5 text-red-600 dark:text-red-400" /> : <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />}
              <span>{showRedactions ? 'Ocultar Censuras' : 'Revelar Censura FOIA'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-paper-600 dark:text-stone-400 hover:text-paper-900 dark:hover:text-stone-100 hover:bg-paper-200 dark:hover:bg-stone-800 transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Longform Dossier Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          {/* Headline & Stamp */}
          <div className="space-y-3 pb-4 border-b border-paper-200 dark:border-stone-800">
            <div className="flex items-center justify-between gap-2">
              <span className={stamp.className}>
                {stamp.icon}
                {stamp.text}
              </span>
              <span className="font-mono text-xs text-paper-500 dark:text-stone-400">
                Índice de Fiabilidad: {Math.round(doc.confidence_score * 100)}%
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-paper-900 dark:text-stone-100 leading-tight">
              {doc.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-paper-600 dark:text-stone-400">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="h-3.5 w-3.5 text-paper-800 dark:text-stone-300" />
                {doc.publication_date || 'Fecha Desconocida'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-paper-800 dark:text-stone-300" />
                {doc.author || 'Oficial de Custodia'}
              </span>
              {doc.repository_name && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Archive className="h-3.5 w-3.5 text-paper-800 dark:text-stone-300" />
                    {doc.repository_name}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* CRITICAL WARNING BANNER IF HOAX */}
          {doc.is_hoax && (
            <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-950 dark:text-red-200 font-sans shadow-paper-sm">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-red-900 dark:text-red-400">
                    DICTAMEN PERICIAL // CONFESIÓN DOCUMENTADA DE FRAUDE
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    <strong>Motivo y Confesión del Autor:</strong> {doc.debunk_reason}
                  </p>
                  {doc.debunk_citation && (
                    <p className="text-xs font-mono text-red-800 dark:text-red-300 mt-1">
                      <strong>Citas Periciales:</strong> {doc.debunk_citation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HISTORICAL PHOTO HERO PLATE */}
          {doc.image_url && (
            <div className="rounded-2xl border border-paper-200 dark:border-stone-800 overflow-hidden bg-paper-100 dark:bg-stone-950 shadow-paper-sm">
              <div className="relative aspect-[16/10] sm:aspect-[21/10] w-full overflow-hidden bg-paper-200 dark:bg-stone-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doc.image_url}
                  alt={doc.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3 bg-paper-150/70 dark:bg-stone-950/90 border-t border-paper-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-sans text-paper-700 dark:text-stone-300">
                <span className="font-serif italic text-paper-800 dark:text-stone-200">{doc.image_caption || 'Registro fotográfico original del expediente.'}</span>
                {doc.photo_credit && (
                  <span className="font-mono text-[11px] text-paper-500 dark:text-stone-400 shrink-0">
                    Foto: {doc.photo_credit}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ARCHIVAL METADATA & REPOSITORY SOURCE */}
          <div className="p-4 rounded-2xl bg-paper-150 dark:bg-stone-950 border border-paper-200 dark:border-stone-800 space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-paper-200 dark:border-stone-800">
              <span className="font-mono font-bold uppercase tracking-wider text-paper-900 dark:text-stone-100 flex items-center gap-1.5">
                <Archive className="h-4 w-4 text-paper-800 dark:text-stone-300" /> Custodia Documental & Signatura
              </span>
              {doc.repository_url && (
                <a
                  href={doc.repository_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-700 dark:text-cyan-400 hover:underline font-semibold"
                >
                  <span>Abrir Archivo Fuente</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-paper-500 dark:text-stone-400 block">Signatura de Archivo:</span>
                <span className="font-mono font-bold text-paper-900 dark:text-stone-100">{doc.archive_reference || 'NARA / FOIA'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-paper-500 dark:text-stone-400 block">Repositorio de Custodia:</span>
                <span className="font-semibold text-paper-900 dark:text-stone-100">{doc.repository_name || 'Archivo Nacional'}</span>
              </div>
            </div>
          </div>

          {/* CHAIN OF EVIDENCE */}
          {doc.evidence_chain && doc.evidence_chain.length > 0 && (
            <div className="p-4 rounded-2xl bg-paper-100 dark:bg-stone-950 border border-paper-200 dark:border-stone-800 space-y-2">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-paper-900 dark:text-stone-100 flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> Cadena de Custodia & Evidencias Registradas
              </h4>
              <ul className="space-y-1.5 pl-2 text-xs font-sans text-paper-800 dark:text-stone-300">
                {doc.evidence_chain.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 shrink-0">[{idx + 1}]</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI SUMMARY BRIEF */}
          <div className="p-4 rounded-2xl bg-paper-100 dark:bg-stone-950 border-l-4 border-paper-900 dark:border-cyan-400 space-y-1">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-paper-900 dark:text-stone-100 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Sumario Ejecutivo de Inteligencia
            </h4>
            <p className="text-xs sm:text-sm font-serif leading-relaxed text-paper-800 dark:text-stone-200">
              {doc.summary}
            </p>
          </div>

          {/* REDACTED EXCERPTS */}
          {doc.redacted_snippets && doc.redacted_snippets.length > 0 && (
            <div className="p-4 rounded-2xl bg-paper-100 dark:bg-stone-950 border border-paper-200 dark:border-stone-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-paper-700 dark:text-stone-300">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-paper-900 dark:text-stone-100">
                  <Layers className="h-3.5 w-3.5" /> Fragmentos Tachados Bajo Censura FOIA
                </span>
                <span className="text-[10px] text-paper-500 dark:text-stone-400">
                  {showRedactions ? '[DECODIFICADO]' : '[CENSURA MILITAR ACTIVA]'}
                </span>
              </div>
              <div className="space-y-2">
                {doc.redacted_snippets.map((snip, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-paper-50 dark:bg-stone-900 border border-paper-200 dark:border-stone-800 leading-relaxed text-paper-900 dark:text-stone-100">
                    {showRedactions ? (
                      <span className="bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 px-1 py-0.5 rounded font-bold">
                        {snip}
                      </span>
                    ) : (
                      <span className="modern-redaction cursor-help" title="Pasa el cursor o pulsa 'Revelar Censura FOIA'">
                        {snip}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ENTITIES IDENTIFIED GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
            <div className="p-3 bg-paper-100 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800">
              <span className="text-paper-500 dark:text-stone-400 uppercase font-mono font-bold text-[10px] block mb-1">
                Forma / Nave:
              </span>
              <div className="flex flex-wrap gap-1 font-mono">
                {doc.entities.craft_types.length > 0 ? (
                  doc.entities.craft_types.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded-md bg-paper-50 dark:bg-stone-900 border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 font-bold">
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-paper-500">Sin especificar</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-paper-100 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800">
              <span className="text-paper-500 dark:text-stone-400 uppercase font-mono font-bold text-[10px] block mb-1">
                Ubicación / Sector:
              </span>
              <div className="flex flex-wrap gap-1">
                {doc.entities.locations.length > 0 ? (
                  doc.entities.locations.map((l) => (
                    <span key={l} className="px-2 py-0.5 rounded-md bg-paper-50 dark:bg-stone-900 border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 font-medium">
                      {l}
                    </span>
                  ))
                ) : (
                  <span className="text-paper-500">No identificada</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-paper-100 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800">
              <span className="text-paper-500 dark:text-stone-400 uppercase font-mono font-bold text-[10px] block mb-1">
                Testigos / Oficiales:
              </span>
              <div className="flex flex-wrap gap-1">
                {doc.entities.people.length > 0 ? (
                  doc.entities.people.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-md bg-paper-50 dark:bg-stone-900 border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 font-medium">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-paper-500">No identificado</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-paper-100 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800">
              <span className="text-paper-500 dark:text-stone-400 uppercase font-mono font-bold text-[10px] block mb-1">
                Agencias / Fuerzas:
              </span>
              <div className="flex flex-wrap gap-1">
                {doc.entities.organizations.length > 0 ? (
                  doc.entities.organizations.map((o) => (
                    <span key={o} className="px-2 py-0.5 rounded-md bg-paper-50 dark:bg-stone-900 border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 font-medium">
                      {o}
                    </span>
                  ))
                ) : (
                  <span className="text-paper-500">No listado</span>
                )}
              </div>
            </div>
          </div>

          {/* PRIMARY TEXT RECORD */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-paper-900 dark:text-stone-100">
              Cuerpo Íntegro del Archivo Desclasificado
            </h4>
            <div className="p-5 rounded-2xl bg-paper-100 dark:bg-stone-950 border border-paper-200 dark:border-stone-800 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto selection:bg-paper-200 dark:selection:bg-stone-800">
              {doc.raw_content}
            </div>
          </div>

          {/* TAGS */}
          <div className="pt-2 border-t border-paper-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <div className="flex flex-wrap gap-1.5">
              {doc.tags.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    onClose();
                    onTagClick(t);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-paper-100 dark:bg-stone-800 border border-paper-300 dark:border-stone-700 text-paper-800 dark:text-stone-200 hover:bg-paper-900 hover:text-paper-50 dark:hover:bg-stone-100 dark:hover:text-stone-900 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-paper-500 dark:text-stone-500 uppercase">
              VENTANA CÓSMICA // REPOSITORIO DESCLASIFICADO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
