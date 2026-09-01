async function parseError(response, fallbackMessage) {
  try {
    const errorBody = await response.json();
    return errorBody.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function uploadDocument(file, owner = '') {
  if (!file) {
    throw new Error('Selecione um arquivo antes de enviar.');
  }

  const formData = new FormData();
  formData.append('file', file);

  if (owner && owner.trim()) {
    formData.append('owner', owner.trim());
  }

  const response = await fetch('/api/documents/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response, 'Não foi possível enviar o documento.'));
  }

  return response.json();
}

export async function getDocuments(owner = '') {
  const params = new URLSearchParams();

  if (owner && owner.trim()) {
    params.set('owner', owner.trim());
  }

  const queryString = params.toString();
  const response = await fetch(`/api/documents${queryString ? `?${queryString}` : ''}`);

  if (!response.ok) {
    throw new Error(await parseError(response, 'Não foi possível carregar os documentos.'));
  }

  return response.json();
}

export async function downloadDocument(id) {
  const response = await fetch(`/api/documents/${id}/download`);

  if (!response.ok) {
    throw new Error(await parseError(response, 'Não foi possível baixar o documento.'));
  }

  return response.blob();
}
