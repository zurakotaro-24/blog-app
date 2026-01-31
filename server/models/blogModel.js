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

export async function getAllBlogs() {
    try {
        const query = `
            SELECT b.id, b.title, b.body_content, b.image, b.publicationdate, b.authorid, 
            CONCAT(u.firstname, ' ', u.lastname) as name 
            FROM blogs as b 
            INNER JOIN users as u 
            ON b.authorid = u.id;
        `;

        const result = await pool.query(query);
        return result.rows.map(row => ({
            id: row.id, 
            title: row.title, 
            description: row.body_content, 
            image: row.image, 
            publicationDate: new Date(row.publicationdate).toLocaleDateString("en-US", {
                year: "numeric", 
                month: "long", 
                day: "numeric",
            }),
            authorId: row.authorid, 
            authorName: row.name
        }));
    }
    catch(err) {
        throw err;
    }
}

export async function getBlogsOfUser(authorId) {
    try {
        const query = `
            SELECT b.id, b.title, b.body_content, b.image, b.publicationdate, b.authorid, 
            CONCAT(u.firstname, ' ', u.lastname) as name 
            FROM blogs as b 
            INNER JOIN users as u 
            ON b.authorid = u.id 
            WHERE u.id = $1;
        `;

        const values = [
            authorId,
        ];

        const result = await pool.query(query, values);
        return result.rows.map(row => ({
            id: row.id, 
            title: row.title, 
            description: row.body_content, 
            image: row.image, 
            publicationDate: new Date(row.publicationdate).toLocaleDateString("en-US", {
                year: "numeric", 
                month: "long", 
                day: "numeric",
            }),
            authorId: row.authorid, 
            authorName: row.name
        }));
    }
    catch(err) {
        throw err;
    }
}

export async function getBlogInfo(blogId) {
    try {
        const query = `
            SELECT b.id, b.title, b.body_content, b.image, b.publicationdate, b.authorid, 
            CONCAT(u.firstname, ' ', u.lastname) as name 
            FROM blogs as b 
            INNER JOIN users as u 
            ON b.authorid = u.id 
            where b.id = $1;
        `;
        
        const values = [
            blogId
        ];

        const result = await pool.query(query, values);
        const row = result.rows[0];
        return {
            id: row.id, 
            title: row.title, 
            description: row.body_content, 
            image: row.image, 
            publicationDate: new Date(row.publicationdate).toLocaleDateString("en-US", {
                year: "numeric", 
                month: "long", 
                day: "numeric",
            }),
            authorId: row.authorid, 
            authorName: row.name
        }
    }
    catch(err) {
        throw err;
    }
}