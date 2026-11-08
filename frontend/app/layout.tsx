import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ventana Cósmica // Archivo Desclasificado & Crónica de Fenómenos Anómalos',
  description: 'Plataforma periodística de investigación y base de datos semántica para el análisis de expedientes desclasificados, telemetría y fenómenos anómalos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-paper-50 dark:bg-stone-950 text-paper-900 dark:text-stone-100 font-serif antialiased selection:bg-paper-200 dark:selection:bg-stone-800">
        {children}
      </body>
    </html>
  );
}
