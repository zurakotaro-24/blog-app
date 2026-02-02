import express from "express";
import multer from "multer";
import { 
    fetchAllBlogComments, 
    insertComment } 
from "../controllers/commentController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/comments 
router.get("/list/:id", fetchAllBlogComments);

// POST /api/comments 
router.post("/upload", 
    upload.fields([
        { name: "image", maxCount: 1 }
    ]), 
    insertComment
);

export default router;