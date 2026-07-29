// controllers/absenceController.js
// Reçoit les requêtes HTTP liées aux absences et appelle le service correspondant.

import {
    listAbsences,
    listAbsencesByStudent,
    addAbsence,
    updateAbsence,
    deleteAbsence
} from "../services/absenceService.js";

import { todayISO } from "../config/date.js";

// ==========================
// Afficher toutes les absences
// ==========================
export function getAbsences(req, res) {

    try {

        const absences = listAbsences();

        res.json(absences);

    } catch (error) {

        console.error("Erreur récupération absences :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Afficher les absences d'un élève précis
// ==========================
export function getStudentAbsences(req, res) {

    try {

        const studentId = req.params.id;

        const absences = listAbsencesByStudent(studentId);

        res.json(absences);

    } catch (error) {

        console.error("Erreur récupération absences élève :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Ajouter une absence
// ==========================
export function createAbsence(req, res) {

    try {

        const { student_id, date, status } = req.body;

        if (!student_id || !status) {
            return res.status(400).json({
                message: "L'élève et le statut sont obligatoires"
            });
        }

        // Si aucune date n'est fournie, on utilise la date du jour par défaut
        addAbsence(student_id, date || todayISO(), status);

        res.json({
            message: "Absence ajoutée avec succès"
        });

    } catch (error) {

        console.error("Erreur ajout absence :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Modifier une absence
// ==========================
export function editAbsence(req, res) {

    try {

        const id = req.params.id;
        const { student_id, date, status } = req.body;

        const changes = updateAbsence(id, student_id, date, status);

        if (changes === 0) {
            return res.status(404).json({
                message: "Absence introuvable"
            });
        }

        res.json({
            message: "Absence modifiée avec succès"
        });

    } catch (error) {

        console.error("Erreur modification absence :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Supprimer une absence
// ==========================
export function removeAbsence(req, res) {

    try {

        const id = req.params.id;

        const changes = deleteAbsence(id);

        if (changes === 0) {
            return res.status(404).json({
                message: "Absence introuvable"
            });
        }

        res.json({
            message: "Absence supprimée avec succès"
        });

    } catch (error) {

        console.error("Erreur suppression absence :", error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}
