import express from "express";
import { 
    createAccount 
} from "../controllers/userController.js";

const router = express.Router();

// POST /api/users
router.post("/create-acc", createAccount);

export default router;