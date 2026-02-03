import asyncHandler from "express-async-handler";
import { supabase } from "../config/supabaseConnection.js";
import {
    createInitialComment,
    getAllCommentsForOneBlog,
    getCommentResult,
    updateCommentImage,
} from "../models/commentModel.js"
import { processImage } from "../services/imageService.js";

// @desc Inserting/Uploading a comment 
// @route POST /api/comments/upload 
export const insertComment = asyncHandler(async(req, res, next) => {
    const {
        commentText, 
        commentorId, 
        blogId,
    } = req.body;

    if(
        !commentText | 
        !commentorId | 
        !blogId
    ) {
        res.status(400);
        throw new Error("All fields must be provided");
    }

    const dateToday = new Date().toISOString().split("T")[0];

    const initialComment = {
        commentText, 
        commentDate: dateToday, 
        commentorId, 
        blogId,
    }

    const created = await createInitialComment(initialComment); 
    
    const commentId = created.id;

    if(!commentId) {
        res.status(500);
        throw new Error("Failed to create blog");
    }

    if(!req.files?.image) {
        const newComment = await getCommentResult(commentId);
        return res.status(200).json({
            id: newComment.id, 
            image: null, 
            commentText: newComment.commenttext, 
            commentDate: new Date(newComment.comment_date).toLocaleDateString("en-US", {
                year: "numeric", 
                month: "long", 
                day: "numeric",
            }), 
            commentorId: newComment.commentorid,   
            blogId: newComment.blogid, 
            commentorName: newComment.commentorname,
        });
    }

    const folderName = `blogs/${blogId}`;
    const bucketName = "blogs-upload";

    let imagePath = "";

    const imageFile = req.files.image[0];
    {
        const fileName = `commentImage_${commentId}`;
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

    await updateCommentImage(commentId, imagePath);
    const newComment = await getCommentResult(commentId);
    return res.status(200).json({
        id: newComment.id, 
        image: newComment.image, 
        commentText: newComment.commenttext, 
        commentDate: new Date(newComment.comment_date).toLocaleDateString("en-US", {
            year: "numeric", 
            month: "long", 
            day: "numeric",
        }), 
        commentorId: newComment.commentorid,   
        blogId: newComment.blogid, 
        commentorName: newComment.commentorname
    });
});

// @desc Get All comments of a blog 
// @route GET /api/comments/list/:id 
export const fetchAllBlogComments = asyncHandler(async(req, res, next) => {
    const blogId = Number(req.params.id);
    const comments = await getAllCommentsForOneBlog(blogId);

    return res.status(200).json(comments);
});