'use client';

import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Link as LinkIcon, 
  FileText, 
  Mic, 
  Loader2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { DocumentItem } from '../types';

interface IngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: (newDoc: DocumentItem) => void;
}

export const IngestionModal: React.FC<IngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess,
}) => {
  const [sourceType, setSourceType] = useState<'MANUAL_TEXT' | 'WEB_URL' | 'AUDIO_TRANSCRIPT'>('MANUAL_TEXT');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('El titular del caso es obligatorio.');
      return;
    }
    if (sourceType === 'WEB_URL' && !sourceUrl.trim()) {
      setErrorMsg('La URL de la fuente es obligatoria.');
      return;
    }
    if (sourceType !== 'WEB_URL' && !rawContent.trim()) {
      setErrorMsg('El cuerpo del documento es obligatorio.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const customTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: title.trim(),
      source_type: sourceType,
      author: author.trim() || undefined,
      publication_date: publicationDate.trim() || undefined,
      source_url: sourceUrl.trim() || undefined,
      raw_content: rawContent.trim() || undefined,
      custom_tags: customTags,
    };

    try {
      const res = await fetch('/api/v1/documents/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Fallo al procesar el documento en el servidor.');
      }

      const createdDoc = await res.json();
      onIngestSuccess(createdDoc);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-paper-900/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-paper-50 dark:bg-stone-900 rounded-3xl border border-paper-300 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh] text-paper-900 dark:text-stone-100 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-paper-100/80 dark:bg-stone-950/80 px-6 py-4 border-b border-paper-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UploadCloud className="h-4 w-4 text-paper-900 dark:text-stone-100" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-paper-900 dark:text-stone-100">
              MESA DE REDACCIÓN // NUEVO EXPEDIENTE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-paper-500 dark:text-stone-400 hover:text-paper-900 dark:hover:text-stone-100 hover:bg-paper-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 font-sans">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-300 text-xs font-sans flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Source Type Selector */}
          <div>
            <label className="block text-xs font-mono uppercase font-bold text-paper-600 dark:text-stone-400 mb-1.5">
              Tipo de Fuente:
            </label>
            <div className="grid grid-cols-3 gap-2 font-sans text-xs">
              <button
                type="button"
                onClick={() => setSourceType('MANUAL_TEXT')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                  sourceType === 'MANUAL_TEXT'
                    ? 'bg-paper-900 dark:bg-stone-100 text-paper-50 dark:text-stone-950 border-paper-900 dark:border-stone-100 font-medium'
                    : 'bg-paper-100 dark:bg-stone-950 text-paper-700 dark:text-stone-400 border-paper-200 dark:border-stone-800 hover:border-paper-400 dark:hover:border-stone-600'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Texto / Acta</span>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('WEB_URL')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                  sourceType === 'WEB_URL'
                    ? 'bg-paper-900 dark:bg-stone-100 text-paper-50 dark:text-stone-950 border-paper-900 dark:border-stone-100 font-medium'
                    : 'bg-paper-100 dark:bg-stone-950 text-paper-700 dark:text-stone-400 border-paper-200 dark:border-stone-800 hover:border-paper-400 dark:hover:border-stone-600'
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Enlace Web</span>
              </button>

              <button
                type="button"
                onClick={() => setSourceType('AUDIO_TRANSCRIPT')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                  sourceType === 'AUDIO_TRANSCRIPT'
                    ? 'bg-paper-900 dark:bg-stone-100 text-paper-50 dark:text-stone-950 border-paper-900 dark:border-stone-100 font-medium'
                    : 'bg-paper-100 dark:bg-stone-950 text-paper-700 dark:text-stone-400 border-paper-200 dark:border-stone-800 hover:border-paper-400 dark:hover:border-stone-600'
                }`}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Transcripción</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase font-bold text-paper-600 dark:text-stone-400 mb-1">
              Titular del Caso / Expediente *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Informe de Radar de la Fragata USS Princeton"
              className="w-full px-3.5 py-2.5 bg-paper-100/70 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-paper-900/10 focus:border-paper-900"
            />
          </div>

          {/* Author & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-paper-600 dark:text-stone-400 mb-1">
                Autor / Testigo / Agencia
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ej: Cmdte. David Fravor, L/L Research"
                className="w-full px-3.5 py-2.5 bg-paper-100/70 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-paper-900/10 focus:border-paper-900"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-paper-600 dark:text-stone-400 mb-1">
                Fecha del Incidente o Registro
              </label>
              <input
                type="text"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                placeholder="Ej: 2004-11-14 o 1990"
                className="w-full px-3.5 py-2.5 bg-paper-100/70 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-paper-900/10 focus:border-paper-900"
              />
            </div>
          </div>

          {/* Web URL */}
          {sourceType === 'WEB_URL' && (
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-paper-600 dark:text-stone-400 mb-1">
                Dirección Web del Repositorio *
              </label>
              <input
                type="url"
                required
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://www.defense.gov/News/..."
                className="w-full px-3.5 py-2.5 bg-paper-100/70 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-paper-900/10 focus:border-paper-900"
              />
            </div>
          )}

          {/* Content */}
          {sourceType !== 'WEB_URL' && (
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-paper-600 dark:text-stone-400 mb-1">
                {sourceType === 'AUDIO_TRANSCRIPT' ? 'Transcripción del Audio *' : 'Cuerpo del Documento *'}
              </label>
              <textarea
                required
                rows={5}
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder={
                  sourceType === 'AUDIO_TRANSCRIPT'
                    ? '[00:01:23] Piloto: Contacto radar a 12 millas náuticas...'
                    : 'Pega aquí el texto del memorándum militar, acta notarial o sesión canalizada...'
                }
                className="w-full px-3.5 py-2.5 bg-paper-100/70 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-paper-900/10 focus:border-paper-900"
              />
            </div>
          )}

          {/* Custom Tags */}
          <div>
            <label className="block text-xs font-mono uppercase font-bold text-paper-600 dark:text-stone-400 mb-1">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#TicTac, #Radar, #Desclasificado"
              className="w-full px-3.5 py-2.5 bg-paper-100/70 dark:bg-stone-950 rounded-xl border border-paper-200 dark:border-stone-800 text-paper-900 dark:text-stone-100 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-paper-900/10 focus:border-paper-900"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-paper-900 dark:bg-stone-100 hover:bg-black dark:hover:bg-white disabled:opacity-50 text-paper-50 dark:text-stone-950 font-sans font-medium text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-paper-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-paper-50 dark:text-stone-950" />
                  <span>Procesando Verificación & Vectores...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 text-paper-50 dark:text-stone-950" />
                  <span>Verificar, Catalogar & Archivar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
