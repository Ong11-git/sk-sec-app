import multer from "multer";

const uploadTempPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default uploadTempPhoto;
