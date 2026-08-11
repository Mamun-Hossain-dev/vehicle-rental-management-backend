import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

const uploadDirectory = path.resolve(env.UPLOAD_PATH);
mkdirSync(uploadDirectory, { recursive: true });

export const vehiclePhotoUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) =>
      callback(
        null,
        `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`,
      ),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(new ApiError(400, 'Photo must be JPEG, PNG, or WebP'));
    }
    callback(null, true);
  },
});
