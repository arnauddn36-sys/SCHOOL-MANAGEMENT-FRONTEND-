// routes/teacherRoutes.js

import express from "express";

import {

    getTeachers,
    createTeacher,
    editTeacher,
    removeTeacher,
    assignTeacherSubject,
    getSubjects,
    getMyTeacherProfile

} from "../controllers/teacherController.js";

import { authorize } from "../utils/permissions.js";

const router = express.Router();

// Profil du professeur connecté (placé avant "/:id" pour ne pas être capturé par elle)
router.get("/me", authorize("teacher"), getMyTeacherProfile);

// Liste des professeurs (admin + professeur)
router.get("/", authorize("admin", "teacher"), getTeachers);

// Récupérer les matières (placé avant "/:id" pour ne pas être capturé par elle)
router.get("/subjects/list", authorize("admin", "teacher"), getSubjects);

// Attribuer une matière à un professeur (placé avant "/:id" pour ne pas être capturé par elle)
router.put("/assign-subject", authorize("admin"), assignTeacherSubject);

// Ajouter un professeur (admin uniquement)
router.post("/", authorize("admin"), createTeacher);

// Modifier un professeur (admin uniquement) -- doit rester après les routes fixes ci-dessus
router.put("/:id", authorize("admin"), editTeacher);

// Supprimer un professeur (admin uniquement)
router.delete("/:id", authorize("admin"), removeTeacher);

export default router;
