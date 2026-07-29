// services/gradeService.js


import db from "../db/database.js";




// ==========================
// Ajouter une note
// ==========================

export function addGrade(student_id, subject_id, note){


    const result = db.prepare(`

        INSERT INTO grades(
            student_id,
            subject_id,
            note
        )

        VALUES (?, ?, ?)

    `).run(
        student_id,
        subject_id,
        note
    );


    return result.lastInsertRowid;

}







export function listGrades() {

    const grades = db.prepare(`
    
        SELECT

            grades.id,

            students.nom,

            students.prenom,

            subjects.nom AS matiere,

            grades.note


        FROM grades


        JOIN students

        ON grades.student_id = students.id


        JOIN subjects

        ON grades.subject_id = subjects.id

    `).all();


    return grades;

}






// ==========================
// Récupérer les notes d'un élève précis
// ==========================

export function listGradesByStudent(studentId){


    const grades = db.prepare(`

        SELECT

            grades.id,

            subjects.nom AS matiere,

            grades.note

        FROM grades

        JOIN subjects

        ON grades.subject_id = subjects.id

        WHERE grades.student_id = ?

    `).all(studentId);


    return grades;

}



// ==========================
// Récupérer une note
// ==========================

export function getGradeById(id){


    const grade = db.prepare(`

        SELECT *

        FROM grades

        WHERE id = ?

    `).get(id);



    return grade;

}







// ==========================
// Modifier une note
// ==========================

export function updateGrade(
    id,
    student_id,
    subject_id,
    note
){


    const result = db.prepare(`


        UPDATE grades

        SET

            student_id = ?,

            subject_id = ?,

            note = ?


        WHERE id = ?


    `).run(
        student_id,
        subject_id,
        note,
        id
    );


    return result.changes;

}







// ==========================
// Supprimer une note
// ==========================

export function deleteGrade(id){


    const result = db.prepare(`

        DELETE FROM grades

        WHERE id = ?

    `).run(id);



    return result.changes;

}