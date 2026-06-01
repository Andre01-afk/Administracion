const express = require('express');
const router = express.Router();

/**
 * GET /api/v1/health
 * Endpoint de prueba para verificar que el servidor está funcionando
 */
router.get('/health', (req, res) => {
  console.log('Health check called');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000
  });
});

/**
 * GET /api/v1/uploads/test
 * Endpoint de prueba para verificar que la ruta de uploads existe
 */
router.get('/uploads-test', (req, res) => {
  console.log('Upload test endpoint called');
  const path = require('path');
  const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'donations');
  res.json({
    uploadDir: uploadDir,
    message: 'Upload directory path'
  });
});

module.exports = router;
