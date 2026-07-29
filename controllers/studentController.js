// controllers/studentController.js
// Reçoit les requêtes HTTP liées aux élèves et appelle le service correspondant.

import {
    listStudents,
    getStudentById,
    getStudentByUserId,
    addStudent,
    updateStudent,
    deleteStudent
} from "../services/studentService.js";

import { listGradesByStudent } from "../services/gradeService.js";
import { listAbsencesByStudent } from "../services/absenceService.js";

// ==========================
// Afficher les élèves
// ==========================
export function getStudents(req, res) {

    try {

        const students = listStudents();

        res.json(students);

    } catch (error) {

        console.error("Erreur récupération élèves :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Afficher un élève par ID
// ==========================
export function getStudent(req, res) {

    try {

        const id = req.params.id;

        const student = getStudentById(id);

        if (!student) {
            return res.status(404).json({
                message: "Élève introuvable"
            });
        }

        res.json(student);

    } catch (error) {

        console.error("Erreur récupération élève :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Afficher le profil de l'élève connecté (via son user_id)
// avec ses notes et absences pour l'espace élève
// ==========================
export function getMyStudentProfile(req, res) {

    try {

        const student = getStudentByUserId(req.userId);

        if (!student) {
            return res.status(404).json({
                message: "Aucun profil élève relié à ce compte"
            });
        }

        const grades = listGradesByStudent(student.id);       // Notes de l'élève
        const absences = listAbsencesByStudent(student.id);    // Absences de l'élève

        res.json({ ...student, grades, absences });

    } catch (error) {

        console.error("Erreur récupération profil élève :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Ajouter un élève
// ==========================
export function createStudent(req, res) {

    try {

        const { matricule, nom, prenom, age, classe } = req.body;

        if (!matricule || !nom || !prenom || !age || !classe) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        addStudent(matricule, nom, prenom, age, classe);

        res.json({
            message: "Élève ajouté avec succès"
        });

    } catch (error) {

        console.error("Erreur ajout élève :", error);

        res.status(500).json({
            message: "Erreur serveur (matricule peut-être déjà utilisé)"
        });
    }
}

// ==========================
// Modifier un élève
// ==========================
export function editStudent(req, res) {

    try {

        const id = req.params.id;
        const { matricule, nom, prenom, age, classe } = req.body;

        const changes = updateStudent(id, matricule, nom, prenom, age, classe);

        if (changes === 0) {
            return res.status(404).json({
                message: "Élève introuvable"
            });
        }

        res.json({
            message: "Élève modifié avec succès"
        });

    } catch (error) {

        console.error("Erreur modification élève :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Supprimer un élève
// ==========================
export function removeStudent(req, res) {

    try {

        const id = req.params.id;

        const changes = deleteStudent(id);

        if (changes === 0) {
            return res.status(404).json({
                message: "Élève introuvable"
            });
        }

        res.json({
            message: "Élève supprimé avec succès"
        });

    } catch (error) {

        console.error("Erreur suppression élève :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}
