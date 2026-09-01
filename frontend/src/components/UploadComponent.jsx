import { useEffect, useState } from 'react';

import { uploadDocument } from '../services/documentApi';

export default function UploadComponent({ onUpload, defaultOwner = '' }) {
  const [owner, setOwner] = useState(defaultOwner);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setOwner(defaultOwner);
  }, [defaultOwner]);

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
    <section className="rounded-lg border border-slate-200 bg-white/95 p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">Enviar documento</h2>
        <p className="mt-1 text-sm text-slate-600">Selecione um arquivo local e informe o owner quando necessário.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          <span>Owner</span>
          <input
            type="text"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Ex.: alice"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          <span>Arquivo</span>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="block w-full cursor-pointer rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </label>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex w-full items-center justify-center rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 sm:w-fit"
        >
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>
    </section>
  );
}
