const fs = require('node:fs/promises');
const path = require('node:path');

const documents = [];
const storageDirectory = path.resolve(__dirname, '../../storage');

async function ensureStorageDirectory() {
  await fs.mkdir(storageDirectory, { recursive: true });
}

async function createDocument({ id, originalName, storedName, mimeType, size, owner }) {
  await ensureStorageDirectory();

  const document = {
    id,
    originalName,
    storedName,
    mimeType,
    size,
    uploadedAt: new Date().toISOString(),
    owner: owner || 'anonymous',
    filePath: path.join(storageDirectory, storedName),
  };

  documents.push(document);

  return { ...document };
}

function listDocuments(owner) {
  const filteredDocuments = owner
    ? documents.filter((document) => document.owner === owner)
    : [...documents];

  return filteredDocuments.map(({ filePath, ...document }) => document);
}

function getById(id) {
  return documents.find((document) => document.id === id) || null;
}

module.exports = {
  createDocument,
  listDocuments,
  getById,
};
