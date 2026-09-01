const crypto = require('node:crypto');
const path = require('node:path');

const documentsRepository = require('../repositories/documents.repository');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeOwner(owner) {
  const value = typeof owner === 'string' ? owner.replace(/[\u0000-\u001f\u007f]/g, '').trim() : '';
  return value.slice(0, 80) || 'anonymous';
}

function ensureValidDocumentId(id) {
  if (!UUID_PATTERN.test(id || '')) {
    const error = new Error('Identificador do documento inválido.');
    error.code = 'INVALID_DOCUMENT_ID';
    throw error;
  }
}

function getStoredName(file, documentId) {
  const storedName = file.filename || `${documentId}${path.extname(file.originalname || '')}`;

  if (path.basename(storedName) !== storedName) {
    const error = new Error('Nome interno do arquivo inválido.');
    error.code = 'INVALID_STORED_NAME';
    throw error;
  }

  return storedName;
}

async function createDocument({ file, owner, id }) {
  if (!file) {
    const error = new Error('Arquivo obrigatório.');
    error.code = 'MISSING_FILE';
    throw error;
  }

  const documentId = id || crypto.randomUUID();
  ensureValidDocumentId(documentId);
  const storedName = getStoredName(file, documentId);

  return documentsRepository.createDocument({
    id: documentId,
    originalName: file.originalname,
    storedName,
    mimeType: file.mimetype || 'application/octet-stream',
    size: file.size,
    owner: normalizeOwner(owner),
  });
}

async function listDocuments(owner) {
  return documentsRepository.listDocuments(owner ? normalizeOwner(owner) : owner);
}

async function getDocumentById(id) {
  if (!UUID_PATTERN.test(id || '')) {
    return null;
  }

  return documentsRepository.getById(id);
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentById,
};
