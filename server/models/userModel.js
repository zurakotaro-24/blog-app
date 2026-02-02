import pool from "../config/dbConnection.js";

export async function createUser(user) {
    try {
        const query = `
            INSERT INTO users(email, password, firstname, lastname) 
            VALUES ($1, $2, $3, $4);
        `;

        const values = [
            user.email, 
            user.password, 
            user.firstName, 
            user.lastName
        ];

        await pool.query(query, values);
    }
    catch(err) {
        throw err;
    }
}

export async function findUserByEmail(email) {
    try {
        const query = `
            SELECT * 
            FROM users 
            WHERE email = $1;
        `;

        const values = [email];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
    catch(err) {
        throw err;
    }
}

export async function getNameById(id) {
    try {
        const query = `
            SELECT CONCAT(firstname, ' ', lastname) as name 
            FROM users 
            WHERE id = $1;
        `;

        const values = [
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
    catch(err) {
        throw err;
    }
}