const crypto = require('node:crypto');
const path = require('node:path');

const documentsRepository = require('../repositories/documents.repository');

function normalizeOwner(owner) {
  const value = typeof owner === 'string' ? owner.trim() : '';
  return value || 'anonymous';
}

function buildStoredFileName(file) {
  const extension = path.extname(file.originalname || '').replace(/[^a-zA-Z0-9.]/g, '');
  return `${crypto.randomUUID()}${extension}`;
}

async function createDocument({ file, owner }) {
  if (!file) {
    const error = new Error('Arquivo obrigatório.');
    error.code = 'MISSING_FILE';
    throw error;
  }

  const documentId = crypto.randomUUID();
  const storedName = `${documentId}${path.extname(file.originalname || '').replace(/[^a-zA-Z0-9.]/g, '')}`;

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
  return documentsRepository.getById(id);
}

module.exports = {
  createDocument,
  listDocuments,
  getDocumentById,
};
