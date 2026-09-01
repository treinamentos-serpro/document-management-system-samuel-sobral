const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');

const documentsController = require('../controllers/documents.controller');

const router = express.Router();
const storageDirectory = path.resolve(__dirname, '../../storage');

fs.mkdirSync(storageDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, storageDirectory);
  },
  filename: (_req, file, callback) => {
    const safeName = path.basename(file.originalname || 'document');
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_SIZE_MB || 10) * 1024 * 1024,
  },
});

router.post('/upload', upload.single('file'), documentsController.uploadDocument);
router.get('/', documentsController.listDocuments);
router.get('/:id/download', documentsController.downloadDocument);

module.exports = router;
