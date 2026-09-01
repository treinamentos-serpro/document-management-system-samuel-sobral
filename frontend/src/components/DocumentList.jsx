import DownloadButton from './DownloadButton';

export default function DocumentList({ documents, ownerFilter, onOwnerFilterChange, onRefresh }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <label htmlFor="ownerFilter" style={{ fontWeight: 600 }}>
          Filtrar por owner
        </label>
        <input
          id="ownerFilter"
          type="text"
          value={ownerFilter}
          onChange={(event) => onOwnerFilterChange(event.target.value)}
          placeholder="Ex.: alice"
          style={{
            padding: '0.6rem 0.8rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            minWidth: '180px',
          }}
        />
        <button
          type="button"
          onClick={onRefresh}
          style={{
            padding: '0.6rem 0.9rem',
            background: '#111827',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Atualizar
        </button>
      </div>

      {documents.length === 0 ? (
        <p style={{ color: '#4b5563' }}>Nenhum documento encontrado.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.9rem' }}>
          {documents.map((document) => (
            <li
              key={document.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                background: '#f9fafb',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <strong>{document.originalName}</strong>
                <div style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                  Owner: {document.owner} · {document.size} bytes
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                  Enviado em {new Date(document.uploadedAt).toLocaleString()}
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
