import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    createUser,
} from "../model/userModel.js";

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
        throw new Error("All fields must be provided");
    }

    const hashedPassword = await bcrypt.hash(acc.password);
    acc.password = hashedPassword;
    await createUser(user);
});