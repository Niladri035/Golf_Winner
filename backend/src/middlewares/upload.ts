import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/apiError';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Use memory storage; we stream directly to Cloudinary */
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(415, 'Unsupported file type. Allowed: JPEG, PNG, WebP, GIF'));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});

/** Single file upload field: "proof" */
export const uploadProof = uploadMiddleware.single('proof');
