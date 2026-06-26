// Set Up Local File Upload Filtering
// to manage incoming multi-part files and enforce validation

const multer = require('multer');
const path = require('path');

// Enforce a hard ceiling limit of 10 Megabytes per file upload
const MAX_SIZE = 10 * 1024 * 1024;
// Restrict uploads to safe document and media types using regular expressions
const ALLOWED_TYPES = /jpeg|jpg|png|pdf|zip|docx|doc/;

// Setup temporary file staging area inside the local filesystem folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    const extname = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
    const mimetype = ALLOWED_TYPES.test(file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb(new Error('Validation Error: Format not allowed. Use Images, PDFs, Docs, or Zips.'));
  }
});

module.exports = upload;
