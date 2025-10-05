import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createResume, deleteResume, getResumeById, getUserResumes, updateResume } from "../controllers/resumeController.js";
import { uploadResumeImages } from "../controllers/uploadImages.js";
import upload from "../middleware/uploadMiddleware.js";

const resumeRouter = express.Router();

resumeRouter.post('/', protect, createResume);
resumeRouter.get('/', protect, getUserResumes);
resumeRouter.get("/:id", protect, getResumeById);

resumeRouter.put('/:id', protect, updateResume);

// ✅ Use multer middleware here
resumeRouter.put(
  "/:id/upload-images",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "profileImage", maxCount: 1 }
  ]),
  uploadResumeImages
);

resumeRouter.delete("/:id", protect, deleteResume);

export default resumeRouter;
