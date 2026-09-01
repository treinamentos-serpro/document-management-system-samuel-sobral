import DownloadButton from './DownloadButton';

function formatUploadedAt(uploadedAt) {
  const date = new Date(uploadedAt);

  if (Number.isNaN(date.getTime())) {
    return 'data indisponível';
  }

  return date.toLocaleString('pt-BR');
}

export default function DocumentList({ documents, ownerFilter, onOwnerFilterChange, onRefresh }) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Documentos</h2>
          <p className="mt-1 text-sm text-slate-600">Filtre por owner ou atualize a lista manualmente.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label htmlFor="ownerFilter" className="grid gap-1.5 text-sm font-medium text-slate-700">
            <span>Filtrar por owner</span>
            <input
              id="ownerFilter"
              type="text"
              value={ownerFilter}
              onChange={(event) => onOwnerFilterChange(event.target.value)}
              placeholder="Ex.: alice"
              className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-48"
            />
          </label>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2"
          >
            Atualizar
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
          Nenhum documento encontrado.
        </div>
      ) : (
        <ul className="grid gap-3">
          {documents.map((document) => (
            <li
              key={document.id}
              className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <strong className="block truncate text-sm font-semibold text-slate-950">{document.originalName}</strong>
                <div className="mt-1 text-sm text-slate-600">
                  Owner: {document.owner} · {document.size} bytes
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Enviado em {formatUploadedAt(document.uploadedAt)}
                </div>
              </div>

              <DownloadButton document={document} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
