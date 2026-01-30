import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    createUser,
    findUserByEmail,
} from "../models/userModel.js";

// @desc Create Account 
// @route POST /api/users/create-acc
// @access Public
export const createAccount = asyncHandler(async(req, res, next) => {
    const user = req.body;
    if(
        !user.email || 
        !user.password || 
        !user.firstName || 
        !user.lastName
    ) {
        res.status(400);
        throw new Error("All fields must be provided.");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    await createUser(user);

    res.status(201).json({ success: true });
});

// @desc Login Account 
// @route GET /api/users/login-acc 
// @access Public 
export const loginAccount = asyncHandler(async(req, res, next) => {
    const acc = req.body;
    if(
        !acc.email || 
        !acc.password
    ) {
        res.status(400);
        throw new Error("All fields must be provided.");
    }

    const user = await findUserByEmail(acc.email);

    if(!user) {
        res.status(401);
        throw new Error("User credentials are not correct.");
    }

    const passwordMatch = await bcrypt.compare(acc.password, user.password);
    if(!passwordMatch) {
        res.status(401);
        throw new Error("User credentials are not correct.");
    }

    const accessToken = jwt.sign(
        {
            id: user.id, 
            email: user.email, 
            name: `${user.firstname} ${user.lastname}`,
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "1d" }
    );

    res.json({
        accessToken
    })
});