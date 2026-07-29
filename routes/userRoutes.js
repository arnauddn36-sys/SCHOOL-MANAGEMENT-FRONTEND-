// routes/userRoutes.js

import express from "express";

import {
    getUsers,
    getUser,
    createUser,
    editUser,
    removeUser
} from "../controllers/userController.js";

import { authorize } from "../utils/permissions.js";

const router = express.Router();

// La gestion des comptes utilisateurs est réservée à l'administrateur.
router.get("/", authorize("admin"), getUsers);
router.get("/:id", authorize("admin"), getUser);
router.post("/", authorize("admin"), createUser);
router.put("/:id", authorize("admin"), editUser);
router.delete("/:id", authorize("admin"), removeUser);

export default router;
