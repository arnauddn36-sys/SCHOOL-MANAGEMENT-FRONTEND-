// routes/gradeRoutes.js

import express from "express";

import {

    getGrades,
    getStudentGrades,
    createGrade,
    editGrade,
    removeGrade

} from "../controllers/gradeController.js";

import { authorize } from "../utils/permissions.js";

const router = express.Router();

// Liste de toutes les notes (admin + professeur)
router.get("/", authorize("admin", "teacher"), getGrades);

// Notes d'un élève précis (admin + professeur + élève concerné)
router.get("/student/:id", authorize("admin", "teacher", "student"), getStudentGrades);

// Ajouter une note (admin + professeur)
router.post("/", authorize("admin", "teacher"), createGrade);

// Modifier une note (admin + professeur)
router.put("/:id", authorize("admin", "teacher"), editGrade);

// Supprimer une note (admin + professeur)
router.delete("/:id", authorize("admin", "teacher"), removeGrade);

export default router;
