import { useState } from 'react';

import { uploadDocument } from '../services/documentApi';

export default function UploadComponent({ onUpload, defaultOwner = '' }) {
  const [owner, setOwner] = useState(defaultOwner);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError('Selecione um arquivo antes de enviar.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const uploadedDocument = await uploadDocument(file, owner);
      setFile(null);
      setOwner(owner || '');
      onUpload(uploadedDocument);
    } catch (uploadError) {
      setError(uploadError.message || 'Não foi possível enviar o arquivo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section style={{ marginTop: '1.5rem' }}>
      <h2>Enviar documento</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem', maxWidth: '520px' }}>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span>Owner</span>
          <input
            type="text"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Ex.: alice"
            style={{ padding: '0.65rem 0.8rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span>Arquivo</span>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            style={{ padding: '0.45rem 0' }}
          />
        </label>

        {error ? (
          <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isUploading}
          style={{
            maxWidth: '180px',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '8px',
            background: isUploading ? '#a5b4fc' : '#1d4ed8',
            color: '#fff',
            fontWeight: 600,
            cursor: isUploading ? 'not-allowed' : 'pointer',
          }}
        >
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>
    </section>
  );
}
