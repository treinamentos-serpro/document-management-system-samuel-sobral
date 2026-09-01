import { useEffect, useState } from 'react';

import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { getDocuments } from './services/documentApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [ownerFilter, setOwnerFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshDocuments = async (currentOwner = ownerFilter) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getDocuments(currentOwner);
      setDocuments(data);
    } catch (loadError) {
      setError(loadError.message || 'Não foi possível carregar os documentos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      refreshDocuments(ownerFilter);
    }, 250);

    return () => clearTimeout(handler);
  }, [ownerFilter]);

  const handleUpload = (uploadedDocument) => {
    setDocuments((previous) => [uploadedDocument, ...previous]);
    refreshDocuments(ownerFilter);
  };

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <h1>Document Management System</h1>
      <p style={{ color: '#374151' }}>
        Envie, consulte e baixe documentos por owner mantendo o armazenamento local do backend.
      </p>

      <UploadComponent onUpload={handleUpload} defaultOwner={ownerFilter} />

      {error ? (
        <p style={{ marginTop: '1rem', color: '#b91c1c' }}>{error}</p>
      ) : null}

      {isLoading ? (
        <p style={{ marginTop: '1rem', color: '#4b5563' }}>Carregando documentos...</p>
      ) : (
        <DocumentList
          documents={documents}
          ownerFilter={ownerFilter}
          onOwnerFilterChange={setOwnerFilter}
          onRefresh={() => refreshDocuments(ownerFilter)}
        />
      )}
    </main>
  );
}
