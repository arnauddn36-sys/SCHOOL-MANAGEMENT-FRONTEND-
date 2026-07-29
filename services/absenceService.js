// services/absenceService.js
// Logique d'accès à la base de données pour les absences.

import db from "../db/database.js"; // Connexion à la base SQLite

// ==========================
// Ajouter une absence
// ==========================
export function addAbsence(student_id, date, status) {

    const result = db.prepare(`
        INSERT INTO absences (student_id, date, status)
        VALUES (?, ?, ?)
    `).run(student_id, date, status);

    return result.lastInsertRowid; // Id de l'absence créée
}

// ==========================
// Lister toutes les absences (avec le nom de l'élève concerné)
// ==========================
export function listAbsences() {

    return db.prepare(`
        SELECT
            absences.id,
            absences.date,
            absences.status,
            students.nom,
            students.prenom
        FROM absences
        JOIN students ON absences.student_id = students.id
        ORDER BY absences.date DESC
    `).all();
}

// ==========================
// Lister les absences d'un élève précis (espace élève / professeur)
// ==========================
export function listAbsencesByStudent(studentId) {

    return db.prepare(`
        SELECT id, date, status
        FROM absences
        WHERE student_id = ?
        ORDER BY date DESC
    `).all(studentId);
}

// ==========================
// Récupérer une absence par son id
// ==========================
export function getAbsenceById(id) {

    return db.prepare(`
        SELECT * FROM absences WHERE id = ?
    `).get(id);
}

// ==========================
// Modifier une absence
// ==========================
export function updateAbsence(id, student_id, date, status) {

    const result = db.prepare(`
        UPDATE absences
        SET student_id = ?, date = ?, status = ?
        WHERE id = ?
    `).run(student_id, date, status, id);

    return result.changes; // Nombre de lignes modifiées
}

// ==========================
// Supprimer une absence
// ==========================
export function deleteAbsence(id) {

    const result = db.prepare(`
        DELETE FROM absences WHERE id = ?
    `).run(id);

    return result.changes; // Nombre de lignes supprimées
}
