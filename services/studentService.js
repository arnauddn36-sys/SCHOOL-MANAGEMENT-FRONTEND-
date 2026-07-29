// services/studentService.js
// Toute la logique d'accès à la base de données pour les élèves.
// Chaque fonction retourne des données (au lieu de faire console.log) car elles
// sont maintenant consommées par les contrôleurs de l'API Express.

import db from "../db/database.js"; // Connexion à la base SQLite

// ==========================
// Ajouter un élève
// ==========================
export function addStudent(matricule, nom, prenom, age, classe, user_id = null) {

    const result = db.prepare(`
        INSERT INTO students(matricule, nom, prenom, age, classe, user_id)
        VALUES(?, ?, ?, ?, ?, ?)
    `).run(matricule, nom, prenom, age, classe, user_id);

    return result.lastInsertRowid; // On renvoie l'id généré pour l'élève créé
}

// ==========================
// Lister tous les élèves
// ==========================
export function listStudents() {

    return db.prepare(`
        SELECT * FROM students
    `).all(); // .all() renvoie toutes les lignes sous forme de tableau d'objets
}

// ==========================
// Récupérer un élève par son id
// ==========================
export function getStudentById(id) {

    return db.prepare(`
        SELECT * FROM students WHERE id = ?
    `).get(id); // .get() renvoie une seule ligne (ou undefined si absente)
}

// ==========================
// Récupérer l'élève lié à un compte utilisateur (espace "Mon profil")
// ==========================
export function getStudentByUserId(userId) {

    return db.prepare(`
        SELECT * FROM students WHERE user_id = ?
    `).get(userId);
}

// ==========================
// Modifier un élève
// ==========================
export function updateStudent(id, matricule, nom, prenom, age, classe) {

    const result = db.prepare(`
        UPDATE students
        SET matricule = ?, nom = ?, prenom = ?, age = ?, classe = ?
        WHERE id = ?
    `).run(matricule, nom, prenom, age, classe, id);

    return result.changes; // Nombre de lignes modifiées (0 si l'id n'existe pas)
}

// ==========================
// Supprimer un élève
// ==========================
export function deleteStudent(id) {

    const result = db.prepare(`
        DELETE FROM students WHERE id = ?
    `).run(id);

    return result.changes; // Nombre de lignes supprimées (0 si l'id n'existe pas)
}
