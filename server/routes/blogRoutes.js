import express from "express";
import multer from "multer";
import {
    insertBlog
} from "../controllers/blogController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/blogs
router.post("/upload", 
    upload.fields([
        { name: "image", maxCount: 1 }
    ]), 
    insertBlog
);

export default router;