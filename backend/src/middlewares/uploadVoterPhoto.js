import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const epicNo = req.body.epicNo
      ? req.body.epicNo.replace(/[^a-zA-Z0-9_-]/g, "")
      : "unknown";

    return {
      folder: "voters",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `voter_${epicNo}_${Date.now()}`,
    };
  },
});

const uploadVoterPhoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default uploadVoterPhoto;
