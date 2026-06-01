const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configurar multer para el test
const testUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

/**
 * POST /api/v1/test/upload-debug
 * Test endpoint sin autenticación para verificar el FormData
 */
router.post('/upload-debug', testUpload.array('images', 10), (req, res) => {
  console.log('\n========== TEST UPLOAD ==========');
  console.log('Headers:', req.headers);
  console.log('Files received:', req.files?.length || 0);
  
  if (req.files && req.files.length > 0) {
    console.log('File details:');
    req.files.forEach((f, i) => {
      console.log(`  [${i}] ${f.originalname} - ${f.size} bytes - ${f.mimetype}`);
    });
  }
  
  console.log('================================\n');
  
  res.json({
    success: true,
    filesReceived: req.files?.length || 0,
    files: req.files?.map(f => ({
      originalname: f.originalname,
      size: f.size,
      mimetype: f.mimetype
    })) || []
  });
});

/**
 * POST /api/v1/test/formdata-debug
 * Test endpoint para debug de FormData (sin multer)
 */
router.post('/formdata-debug', (req, res) => {
  console.log('\n========== FORMDATA DEBUG ==========');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', Object.keys(req.body || {}));
  console.log('================================\n');
  
  res.json({
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length'],
    bodyKeys: Object.keys(req.body || {})
  });
});

module.exports = router;
