import { useState } from 'react';

import { downloadDocument } from '../services/documentApi';

export default function DownloadButton({ document: doc }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

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
    } catch (error) {
      window.alert(error.message || 'Não foi possível baixar o documento.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      style={{
        padding: '0.5rem 0.8rem',
        border: '1px solid #2563eb',
        background: isDownloading ? '#93c5fd' : '#2563eb',
        color: '#fff',
        borderRadius: '6px',
        cursor: isDownloading ? 'not-allowed' : 'pointer',
      }}
    >
      {isDownloading ? 'Baixando...' : 'Baixar'}
    </button>
  );
}
