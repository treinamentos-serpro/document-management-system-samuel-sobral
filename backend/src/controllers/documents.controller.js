const fs = require('node:fs');

const documentsService = require('../services/documents.service');

async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Arquivo obrigatório.' });
    }

    const document = await documentsService.createDocument({
      file: req.file,
      owner: req.body ? req.body.owner : undefined,
    });

    return res.status(201).json({
      id: document.id,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      uploadedAt: document.uploadedAt,
      owner: document.owner,
    });
  } catch (error) {
    if (error.code === 'MISSING_FILE') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Não foi possível processar o upload do documento.' });
  }
}

async function listDocuments(req, res) {
  try {
    const documents = await documentsService.listDocuments(req.query.owner);
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ message: 'Não foi possível listar os documentos.' });
  }
}

async function downloadDocument(req, res) {
  try {
    const document = await documentsService.getDocumentById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    const fileStream = fs.createReadStream(document.filePath);
    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);

    fileStream.on('error', () => {
      res.status(500).json({ message: 'Não foi possível recuperar o documento.' });
    });

    fileStream.pipe(res);
  } catch (error) {
    return res.status(500).json({ message: 'Não foi possível baixar o documento.' });
  }
}

module.exports = {
  uploadDocument,
  listDocuments,
  downloadDocument,
};
