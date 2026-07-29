import db from "../db/database.js";




// ==========================
// Ajouter une matière
// ==========================

export function addSubject(nom){


    const result = db.prepare(`

        INSERT INTO subjects(
            nom
        )

        VALUES(?)

    `).run(
        nom
    );


    return result.lastInsertRowid;

}








// ==========================
// Lister les matières
// ==========================

export function listSubjects(){


    const subjects = db.prepare(`

        SELECT *

        FROM subjects

    `).all();



    return subjects;

}








// ==========================
// Récupérer une matière par ID
// ==========================

export function getSubjectById(id){


    const subject = db.prepare(`

        SELECT *

        FROM subjects

        WHERE id = ?

    `).get(id);



    return subject;

}








// ==========================
// Modifier une matière
// ==========================

export function updateSubject(id, nom){


    const result = db.prepare(`

        UPDATE subjects

        SET nom = ?

        WHERE id = ?

    `).run(

        nom,

        id

    );



    return result.changes;

}








// ==========================
// Supprimer une matière
// ==========================

export function deleteSubject(id){



    // Supprimer les associations professeur-matière

    db.prepare(`

        DELETE FROM teacher_subjects

        WHERE subject_id = ?

    `).run(id);




    // Supprimer la matière

    const result = db.prepare(`

        DELETE FROM subjects

        WHERE id = ?

    `).run(id);



    return result.changes;

}