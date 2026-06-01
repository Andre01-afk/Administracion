const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, '..', 'uploads');
const uploadDir = path.join(uploadsDir, 'donations');

console.log('Upload directory path:', uploadDir);

// Asegurar que el directorio existe
if (!fs.existsSync(uploadDir)) {
  console.log('Creating upload directory...');
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Upload directory created');
}

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('[Multer] destination() called');
    console.log('[Multer] file.fieldname:', file.fieldname);
    console.log('[Multer] file.originalname:', file.originalname);
    console.log('[Multer] file.mimetype:', file.mimetype);
    console.log('[Multer] Saving to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log('[Multer] filename() called for:', file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${name}-${uniqueSuffix}${ext}`;
    console.log('[Multer] Generated filename:', filename);
    cb(null, filename);
  }
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
  console.log('[Multer Filter] Processing file:', file.originalname);
  console.log('[Multer Filter] MIME type:', file.mimetype);
  
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    console.log('[Multer Filter] ✓ File accepted');
    cb(null, true);
  } else {
    console.log('[Multer Filter] ✗ File rejected - invalid MIME type');
    cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`), false);
  }
};

// Crear middleware multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Wrapper para logging
const uploadWithLogging = upload.array('images', 10);

module.exports = (req, res, next) => {
  console.log('[Upload Middleware] Request received');
  console.log('[Upload Middleware] Content-Type:', req.headers['content-type']);
  console.log('[Upload Middleware] Content-Length:', req.headers['content-length']);
  
  uploadWithLogging(req, res, (err) => {
    console.log('[Upload Middleware] After multer');
    console.log('[Upload Middleware] Files received:', req.files?.length || 0);
    
    if (req.files && req.files.length > 0) {
      console.log('[Upload Middleware] File details:');
      req.files.forEach((f, i) => {
        console.log(`  [${i}] ${f.filename} (${f.size} bytes)`);
      });
    }
    
    if (err) {
      console.error('[Upload Middleware] Error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    
    next();
  });
};
