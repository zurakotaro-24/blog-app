import pool from "../config/dbConnection.js";

export async function createUser(user) {
    try {
        const query = `
            INSERT INTO users(email, password, firstName, lastName) 
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