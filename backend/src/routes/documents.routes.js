const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const multer = require('multer');

const documentsController = require('../controllers/documents.controller');

const router = express.Router();
const storageDirectory = path.resolve(__dirname, '../../storage');

fs.mkdirSync(storageDirectory, { recursive: true });

function getSafeExtension(originalName) {
  const extension = path.extname(originalName || '').toLowerCase();
  return /^[.][a-z0-9]{1,12}$/.test(extension) ? extension : '';
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, storageDirectory);
  },
  filename: (req, file, callback) => {
    const documentId = crypto.randomUUID();
    req.documentId = documentId;

    callback(null, `${documentId}${getSafeExtension(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_SIZE_MB || 10) * 1024 * 1024,
  },
});

function handleUpload(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Arquivo excede o tamanho máximo permitido.' });
    }

    return res.status(400).json({ message: 'Não foi possível receber o arquivo enviado.' });
  });
}

router.post('/upload', handleUpload, documentsController.uploadDocument);
router.get('/', documentsController.listDocuments);
router.get('/:id/download', documentsController.downloadDocument);

module.exports = router;
