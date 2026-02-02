import express from "express";
import multer from "multer";
import { insertComment } from "../controllers/commentController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/comments 
router.post("/upload", 
    upload.fields([
        { name: "image", maxCount: 1 }
    ]), 
    insertComment
);

export default router;