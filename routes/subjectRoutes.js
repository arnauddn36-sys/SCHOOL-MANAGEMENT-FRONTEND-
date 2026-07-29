// routes/subjectRoutes.js

import express from "express";

import {

    getSubjects,
    createSubject,
    editSubject,
    removeSubject

} from "../controllers/subjectController.js";

import { authorize } from "../utils/permissions.js";

const router = express.Router();

// Liste des matières (admin + professeur, utile pour les formulaires de notes)
router.get("/", authorize("admin", "teacher"), getSubjects);

// Ajouter une matière (admin uniquement)
router.post("/", authorize("admin"), createSubject);

// Modifier une matière (admin uniquement)
router.put("/:id", authorize("admin"), editSubject);

// Supprimer une matière (admin uniquement)
router.delete("/:id", authorize("admin"), removeSubject);

export default router;
