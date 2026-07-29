// routes/authRoutes.js

import express from "express";
import { login } from "../controllers/authController.js";


const router = express.Router();



// ROUTE DE CONNEXION

// POST /api/auth/login
router.post("/login", login);



// Export du routeur
export default router;