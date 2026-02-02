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

        await pool.query(query, values);
    }
    catch(err) {
        throw err;
    }
}

export async function getCommentResult(commentId) {
    try {
        const query = `
            SELECT c.id, c.image, c.commenttext, c.comment_date, c.commentorid, c.blogid, CONCAT(u.firstname, ' ', u.lastname) as commentorName 
            FROM comments c 
            INNER JOIN users u 
            ON c.commentorid = u.id 
            WHERE c.id = $1;
        `;

        const values = [
            commentId,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
    catch(err) {
        throw err;
    }
}

export async function getAllCommentsForOneBlog(blogid) {
    try {
        const query = `
            SELECT c.id, c.image, c.commenttext, c.comment_date, c.commentorid, c.blogid, CONCAT(u.firstname, ' ', u.lastname) as commentorname 
            FROM comments c 
            INNER JOIN users u 
            ON c.commentorid = u.id 
            WHERE c.blogid = $1;
        `; 

        const values = [
            blogid
        ];

        const result = await pool.query(query, values);
        return result.rows.map(row => ({
            id: row.id, 
            image: row.image ? row.image : null, 
            commentText: row.commenttext, 
            commentDate: new Date(row.comment_date).toLocaleDateString("en-US", {
                year: "numeric", 
                month: "long", 
                day: "numeric",
            }),
            commentorId: row.commentorid, 
            blogId: row.blogid, 
            commentorName: row.commentorname,
        }));
    }
    catch(err) {
        throw err;
    }
}