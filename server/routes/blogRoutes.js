import express from "express";
import multer from "multer";
import {
    deleteBlogInfo,
    fetchAllBlogs,
    fetchBlogInfo,
    fetchBlogs,
    insertBlog,
    updateBlogInfo
} from "../controllers/blogController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/blogs
router.get("/list", fetchAllBlogs);
router.get("/list/:id", fetchBlogs);
router.get("/:id", fetchBlogInfo);

// POST /api/blogs
router.post("/upload", 
    upload.fields([
        { name: "image", maxCount: 1 }
    ]), 
    insertBlog
);

// PATCH /api/blogs
router.patch("/update", 
    upload.fields([
        { name: "image", maxCount: 1 }
    ]), 
    updateBlogInfo
);

// DELETE /api/blogs
router.delete("/:id", deleteBlogInfo);

export default router;