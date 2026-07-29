// routes/absenceRoutes.js

import express from "express";

import {
    getAbsences,
    getStudentAbsences,
    createAbsence,
    editAbsence,
    removeAbsence
} from "../controllers/absenceController.js";

import { authorize } from "../utils/permissions.js";

const router = express.Router();

// ==========================
// Liste de toutes les absences (admin + professeur)
// ==========================
router.get("/", authorize("admin", "teacher"), getAbsences);

// ==========================
// Absences d'un élève précis (admin + professeur + élève concerné)
// ==========================
router.get("/student/:id", authorize("admin", "teacher", "student"), getStudentAbsences);

// ==========================
// Ajouter une absence (admin + professeur)
// ==========================
router.post("/", authorize("admin", "teacher"), createAbsence);

// ==========================
// Modifier une absence (admin + professeur)
// ==========================
router.put("/:id", authorize("admin", "teacher"), editAbsence);

// ==========================
// Supprimer une absence (admin + professeur)
// ==========================
router.delete("/:id", authorize("admin", "teacher"), removeAbsence);

export default router;
