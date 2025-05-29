import multer from 'multer';
import path from 'path';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/videos');  // Directory to save video files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${ext}`;  // Unique filename
    cb(null, fileName);
  }
});

// Initialize Multer with storage configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,  // 100 MB limit
    fieldNameSize: 100,           // Max field name size in bytes
    fieldSize: 100 * 1024 * 1024  // Max field value size in bytes (if applicable)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(new Error('Only .mp4 files are allowed'), false);
    }
    cb(null, true);
  }
});

export default upload;
