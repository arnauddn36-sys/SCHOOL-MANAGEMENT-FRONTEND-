import db from "../db/database.js";



// ==========================
// Ajouter une matière à un professeur
// ==========================


export function assignSubject(teacherId, subjectId){


    const result = db.prepare(`

        INSERT INTO teacher_subjects(
            teacher_id,
            subject_id
        )

        VALUES(?, ?)

    `)
    .run(
        teacherId,
        subjectId
    );


    return result.lastInsertRowid;

}






// ==========================
// Voir les matières d'un professeur
// ==========================


export function getTeacherSubjects(teacherId){


    const subjects = db.prepare(`

        SELECT

            subjects.id,
            subjects.nom

        FROM subjects


        JOIN teacher_subjects

        ON subjects.id = teacher_subjects.subject_id


        WHERE teacher_subjects.teacher_id = ?

    `)
    .all(teacherId);



    return subjects;

}






// ==========================
// Retirer une matière
// ==========================


export function removeSubject(
    teacherId,
    subjectId
){


    const result = db.prepare(`

        DELETE FROM teacher_subjects

        WHERE teacher_id = ?

        AND subject_id = ?

    `)
    .run(
        teacherId,
        subjectId
    );


    return result.changes;

}