import express from "express";
import { 
    createAccount, 
    loginAccount
} from "../controllers/userController.js";

const router = express.Router();

// POST /api/users
router.post("/create-acc", createAccount);
router.post("/login-acc", loginAccount);

export default router;