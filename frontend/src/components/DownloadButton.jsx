import { useState } from 'react';

import { downloadDocument } from '../services/documentApi';

export default function DownloadButton({ document: doc }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setIsDownloading(true);
    setError('');

    try {
      const blob = await downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.originalName || 'documento';
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError.message || 'Não foi possível baixar o documento.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="grid gap-2 sm:justify-items-end">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex w-full items-center justify-center rounded-md border border-teal-700 bg-white px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500 sm:w-auto"
      >
        {isDownloading ? 'Baixando...' : 'Baixar'}
      </button>
      {error ? (
        <p className="max-w-56 text-right text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
