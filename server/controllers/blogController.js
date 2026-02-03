import asyncHandler from "express-async-handler";
import {
    createInitialBlog, 
    getAllBlogs, 
    updateBlogImage, 
    getBlogsOfUser,
    getBlogInfo,
    deleteBlog, 
    updateBlog, 
} from "../models/blogModel.js";
import { processImage } from "../services/imageService.js";
import { supabase } from "../config/supabaseConnection.js";
import { getNameById } from "../models/userModel.js";

// @desc Inserting/Uploading a blog 
// @route POST /api/blogs/upload
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
            });

        if(error) {
            console.error(error.message);
            throw error;
        }

        imagePath = objectPath;
    }

    const updatedBlog = await updateBlogImage(blogId, imagePath); 
    const author = await getNameById(authorId);
    return res.status(200).json({
        id: updatedBlog.id, 
        title: updatedBlog.title, 
        description: updatedBlog.body_content, 
        image: updatedBlog.image, 
        publicationDate: updatedBlog.publicationdate, 
        authorId: updatedBlog.authorId, 
        authorName: author.name
    });
});

// @desc Get all blogs 
// @route GET /api/blogs/list 
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
export const fetchBlogInfo = asyncHandler(async(req, res, next) => {
    const blogId = Number(req.params.id);
    const blog = await getBlogInfo(blogId);
    if(!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }
    return res.status(200).json(blog);
});

// @desc Delete a blog 
// @route DELETE /api/blogs/:id 
export const deleteBlogInfo = asyncHandler(async(req, res, next) => {
    const blogId = Number(req.params.id);
    await deleteBlog(blogId);
    return res.status(200).json({ success: true });
});

// @desc Update a blog
// @route PATCH /api/blogs/update
export const updateBlogInfo = asyncHandler(async(req, res, next) => {
    const {
        id, 
        title, 
        description, 
        imagePath
    } = req.body;

    const folderName = `blogs/${id}`;
    const bucketName = "blogs-upload";

    let newImagePath = imagePath;

    if(req.files?.image) {
        const imageFile = req.files?.image[0];

        if(imageFile) {
            const fileName = `blogImage`;
            const { buffer, ext, mimeType } = await processImage(imageFile.buffer);
            const objectPath = `${folderName}/${fileName}_${Date.now()}${ext}`;
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

            newImagePath = objectPath;
        }
    }


    const updatedBlog = {
        title: title, 
        description: description, 
        id: id,
        imagePath: newImagePath,
    }

    const result = await updateBlog(updatedBlog);
    return res.status(200).json({ 
        id: result.id, 
        title: result.title, 
        description: result.body_content,
        image: result.image
    });
});