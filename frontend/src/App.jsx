import { useEffect, useRef, useState } from 'react';

import DocumentList from './components/DocumentList';
import UploadComponent from './components/UploadComponent';
import { getDocuments } from './services/documentApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [ownerFilter, setOwnerFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const requestSequence = useRef(0);

  const refreshDocuments = async (currentOwner = ownerFilter) => {
    const requestId = requestSequence.current + 1;
    requestSequence.current = requestId;

    try {
      setIsLoading(true);
      setError('');
      const data = await getDocuments(currentOwner);

      if (requestSequence.current === requestId) {
        setDocuments(data);
      }
    } catch (loadError) {
      if (requestSequence.current === requestId) {
        setError(loadError.message || 'Não foi possível carregar os documentos.');
      }
    } finally {
      if (requestSequence.current === requestId) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      refreshDocuments(ownerFilter);
    }, 250);

    return () => clearTimeout(handler);
  }, [ownerFilter]);

  const handleUpload = () => {
    refreshDocuments(ownerFilter);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef5f2_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <header className="rounded-lg border border-slate-200 bg-white/90 p-5 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Gestão de documentos</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Document Management System</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Envie, consulte e baixe documentos por owner mantendo o armazenamento local do backend.
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{documents.length}</span> documento(s)
            </div>
          </div>
        </header>

        <UploadComponent onUpload={handleUpload} defaultOwner={ownerFilter} />

        <section className="rounded-lg border border-slate-200 bg-white/95 p-5 shadow-sm">
          {error ? (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600" role="status">
              Carregando documentos...
            </div>
          ) : (
            <DocumentList
              documents={documents}
              ownerFilter={ownerFilter}
              onOwnerFilterChange={setOwnerFilter}
              onRefresh={() => refreshDocuments(ownerFilter)}
            />
          )}
        </section>
      </div>
    </main>
  );
}
