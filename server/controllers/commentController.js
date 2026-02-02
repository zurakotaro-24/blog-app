import asyncHandler from "express-async-handler";
import { supabase } from "../config/supabaseConnection.js";
import {
    createInitialComment,
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
        return res.status(200).json({
            id: created.id, 
            image: null, 
            commentText: created.commenttext, 
            commentDate: created.comment_date, 
            commentorId: created.commentid,   
            blogId: created.blogid,
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

    const updated = await updateCommentImage(commentId, imagePath);
    return res.status(200).json({
        id: updated.id, 
        image: updated.image, 
        commentText: updated.commenttext, 
        commentDate: updated.comment_date, 
        commentorId: updated.commentid,   
        blogId: updated.blogid,
    });
});