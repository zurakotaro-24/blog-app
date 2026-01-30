import pool from "../config//dbConnection.js";

export async function createInitialBlog(blog) {
    try {
        const query = `
            INSERT INTO blogs(title, body_content, publicationdate, authorid) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;

        const values = [
            blog.title, 
            blog.description, 
            blog.publicationdate, 
            blog.authorid,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
    catch(err) {
        throw err;
    }
}

export async function updateBlogImage(blogId, imagePath) {
    try {
        const query = `
            UPDATE blogs 
            SET image = $1 
            WHERE id = $2 
            RETURNING *;
        `;

        const values = [
            imagePath, 
            blogId,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
    catch(err) {
        throw err;
    }
}