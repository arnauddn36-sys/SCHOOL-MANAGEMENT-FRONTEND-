// routes/studentRoutes.js

import express from "express";

import {
    getStudents,
    getStudent,
    getMyStudentProfile,
    createStudent,
    editStudent,
    removeStudent
} from "../controllers/studentController.js";

import { authorize } from "../utils/permissions.js";

const router = express.Router();

// ==========================
// Profil de l'élève connecté (avant la route "/:id" pour ne pas être capturée par elle)
// ==========================
router.get("/me", authorize("student"), getMyStudentProfile);

// ==========================
// Liste des élèves (admin + professeur)
// ==========================
router.get("/", authorize("admin", "teacher"), getStudents);

// ==========================
// Un élève par ID (admin + professeur)
// ==========================
router.get("/:id", authorize("admin", "teacher"), getStudent);

// ==========================
// Ajouter un élève (admin uniquement)
// ==========================
router.post("/", authorize("admin"), createStudent);

// ==========================
// Modifier un élève (admin uniquement)
// ==========================
router.put("/:id", authorize("admin"), editStudent);

// ==========================
// Supprimer un élève (admin uniquement)
// ==========================
router.delete("/:id", authorize("admin"), removeStudent);

export default router;
