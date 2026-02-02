import pool from "../config/dbConnection.js"; 

export async function createInitialComment(comment) {
    try {
        const query = `
            INSERT INTO comments(commenttext, comment_date, commentorid, blogid) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;

        const values = [
            comment.commentText, 
            comment.commentDate, 
            comment.commentorId, 
            comment.blogId,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
    catch(err) {
        throw err;
    }
}

export async function updateCommentImage(commentId, imagePath) {
    try {
        const query = `
            UPDATE comments 
            SET image = $1 
            WHERE id = $2 
            RETURNING *;
        `;

        const values = [
            imagePath, 
            commentId,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
    catch(err) {
        throw err;
    }
}