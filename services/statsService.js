import db from "../db/database.js";



// ==========================
// Meilleur élève
// ==========================

export function getBestStudent() {


    const result = db.prepare(`
        SELECT 
            students.id,
            students.nom,
            students.prenom,
            AVG(grades.note) AS moyenne
        FROM students
        JOIN grades 
        ON students.id = grades.student_id
        GROUP BY students.id
        ORDER BY moyenne DESC
        LIMIT 1
    `).get();



    return result;

}







// ==========================
// Moyenne générale
// ==========================

export function getGeneralAverage() {


    const result = db.prepare(`
        SELECT AVG(note) AS moyenne_generale
        FROM grades
    `).get();



    return result.moyenne_generale;

}







// ==========================
// Nombre utilisateurs
// ==========================

export function countUsers() {


    const result = db.prepare(`
        SELECT COUNT(*) AS total
        FROM users
    `).get();



    return result.total;

}







// ==========================
// Nombre élèves
// ==========================

export function countStudents() {


    const result = db.prepare(`
        SELECT COUNT(*) AS total
        FROM students
    `).get();



    return result.total;

}







// ==========================
// Nombre professeurs
// ==========================

export function countTeachers() {


    const result = db.prepare(`
        SELECT COUNT(*) AS total
        FROM teachers
    `).get();



    return result.total;

}







// ==========================
// Nombre matières
// ==========================

export function countSubjects() {


    const result = db.prepare(`
        SELECT COUNT(*) AS total
        FROM subjects
    `).get();



    return result.total;

}







// ==========================
// Nombre notes
// ==========================

export function countGrades() {


    const result = db.prepare(`
        SELECT COUNT(*) AS total
        FROM grades
    `).get();



    return result.total;

}







// ==========================
// Nombre absences
// ==========================

export function countAbsences() {


    const result = db.prepare(`
        SELECT COUNT(*) AS total_absences
        FROM absences
    `).get();



    return result.total_absences;

}







// ==========================
// Toutes les statistiques
// ==========================

export function getStats() {


    return {


        utilisateurs: countUsers(),

        eleves: countStudents(),

        professeurs: countTeachers(),

        matieres: countSubjects(),

        notes: countGrades(),

        absences: countAbsences(),


        moyenneGenerale: getGeneralAverage(),

        meilleurEleve: getBestStudent()


    };

}