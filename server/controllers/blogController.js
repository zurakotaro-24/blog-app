import asyncHandler from "express-async-handler";
import {
    createInitialBlog, 
    getAllBlogs, 
    updateBlogImage, 
    getBlogsOfUser,
    getBlogInfo,
} from "../models/blogModel.js";
import { processImage } from "../services/imageService.js";
import { supabase } from "../config/supabaseConnection.js";

// @desc Inserting/Uploading a blog 
// @route POST /api/blogs/upload
// @access Public
export const insertBlog = asyncHandler(async(req, res, next) => {    
    const { 
        title,  
        description, 
        authorId
    } = req.body;
    
    if(
        !title | 
        !description | 
        !authorId 
    ) {
        res.status(400);
        throw new Error("All fields must be provided.");
    }

    if(!req.files?.image) {
        res.status(400);
        throw new Error("An image is required.");
    }

    const dateToday = new Date().toISOString().split("T")[0];

    const initialBlog = {
        title, 
        description, 
        image: "", 
        publicationdate: dateToday, 
        authorid: authorId,
    }

    const created = await createInitialBlog(initialBlog);

    const blogId = created.id;

    if(!blogId) {
        res.status(500);
        throw new Error("Failed to create blog.");
    }

    const folderName = `blogs/${blogId}`;
    const bucketName = "blogs-upload";

    let imagePath = "";

    const imageFile = req.files.image[0];
    {
        const fileName = `blogImage`;
        const { buffer, ext, mimeType } = await processImage(imageFile.buffer);
        const objectPath = `${folderName}/${fileName}${ext}`;
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(objectPath, buffer, {
                contentType: mimeType, 
                upsert: true,
            })

        if(error) {
            console.error(error.message);
            throw error;
        }

        imagePath = objectPath;
    }

    const uploadedBlog = await updateBlogImage(blogId, imagePath);
    return res.status(200).json(uploadedBlog);
});

// @desc Get all blogs 
// @route GET /api/blogs/list 
// @access Public 
export const fetchAllBlogs = asyncHandler(async(req, res, next) => {
    const blogs = await getAllBlogs();
    if(!blogs) {
        res.status(404); 
        throw new Error("Blogs not found");
    }
    return res.status(200).json(blogs);
});

// @desc Get all blogs for one user
// @route GET /api/blogs/list/:id
// @access Public 
export const fetchBlogs = asyncHandler(async(req, res, next) => {
    const authorId = Number(req.params.id);
    const blogs = await getBlogsOfUser(authorId);
    if(!blogs) {
        res.status(404);
        throw new Error("Blogs not found");
    }
    return res.status(200).json(blogs);
});

// @desc Get Blog info 
// @route GET /api/blogs/:id
// @access Public
export const fetchBlogInfo = asyncHandler(async(req, res, next) => {
    const blogId = Number(req.params.id);
    const blog = await getBlogInfo(blogId);
    if(!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }
    return res.status(200).json(blog);
});