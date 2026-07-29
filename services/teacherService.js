import db from "../db/database.js";



// ==========================
// Ajouter un professeur
// ==========================

export function addTeacher(nom, prenom) {


    const result = db.prepare(`

        INSERT INTO teachers(
            nom,
            prenom
        )

        VALUES (?, ?)

    `).run(
        nom,
        prenom
    );


    return result.lastInsertRowid;

}







// ==========================
// Récupérer un professeur par ID
// ==========================

export function getTeacherById(id) {


    const teacher = db.prepare(`

        SELECT *

        FROM teachers

        WHERE id = ?

    `).get(id);



    return teacher;

}








// ==========================
// Lister les professeurs avec leurs matières
// ==========================

export function listTeachers() {


    const teachers = db.prepare(`

        SELECT

            teachers.id,

            teachers.nom,

            teachers.prenom,


            GROUP_CONCAT(subjects.nom) AS matieres


        FROM teachers


        LEFT JOIN teacher_subjects

        ON teachers.id = teacher_subjects.teacher_id


        LEFT JOIN subjects

        ON teacher_subjects.subject_id = subjects.id


        GROUP BY teachers.id


    `).all();



    return teachers.map(teacher => ({


        ...teacher,


        matieres: teacher.matieres

            ? teacher.matieres.split(",")

            : []


    }));

}









// ==========================
// Récupérer le professeur lié à un compte utilisateur (espace "Mon profil")
// ==========================

export function getTeacherByUserId(userId) {


    const teacher = db.prepare(`

        SELECT *

        FROM teachers

        WHERE user_id = ?

    `).get(userId);



    return teacher;

}



// ==========================
// Modifier un professeur
// ==========================

export function updateTeacher(id, nom, prenom) {


    const result = db.prepare(`

        UPDATE teachers

        SET

            nom = ?,

            prenom = ?


        WHERE id = ?

    `).run(

        nom,

        prenom,

        id

    );



    return result.changes;

}









// ==========================
// Supprimer un professeur
// ==========================

export function deleteTeacher(id) {



    // Supprime les associations professeur-matière

    db.prepare(`

        DELETE FROM teacher_subjects

        WHERE teacher_id = ?

    `).run(id);




    // Supprime le professeur

    const result = db.prepare(`

        DELETE FROM teachers

        WHERE id = ?

    `).run(id);



    return result.changes;

}









// ==========================
// Assigner une matière
// ==========================

export function assignSubject(teacherId, subjectId) {


    const result = db.prepare(`

        INSERT INTO teacher_subjects(

            teacher_id,

            subject_id

        )

        VALUES (?, ?)

    `).run(

        teacherId,

        subjectId

    );



    return result.changes;

}









// ==========================
// Liste des matières
// ==========================

export function listSubjects() {


    return db.prepare(`

        SELECT *

        FROM subjects

    `).all();

}