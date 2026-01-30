import express from "express";
import multer from "multer";
import {
    fetchAllBlogs,
    fetchBlogs,
    insertBlog
} from "../controllers/blogController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/blogs
router.get("/list", fetchAllBlogs);
router.get("/list/:id", fetchBlogs);

// POST /api/blogs
router.post("/upload", 
    upload.fields([
        { name: "image", maxCount: 1 }
    ]), 
    insertBlog
);

export default router;