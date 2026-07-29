import db from "../db/database.js";



// ==========================
// Ajouter un utilisateur
// ==========================

export function addUser(nom, prenom, password, role) {


    const existingUser = db.prepare(`
        SELECT *
        FROM users
        WHERE password = ?
    `).get(password);



    if (existingUser) {

        console.log(
            "Ce mot de passe est déjà utilisé."
        );

        return false;

    }



    db.prepare(`
        INSERT INTO users (nom, prenom, password, role)
        VALUES (?, ?, ?, ?)
    `).run(
        nom,
        prenom,
        password,
        role
    );



    return true;

}






// ==========================
// Récupérer un utilisateur par ID
// ==========================

export function getUserById(id) {


    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
    `).get(id);



    if (!user) {

        console.log(
            `Aucun utilisateur trouvé avec l'ID ${id}`
        );

        return null;

    }



    return user;

}






// ==========================
// Liste de tous les utilisateurs
// ==========================

export function listUsers() {


    const users = db.prepare(`
        SELECT *
        FROM users
    `).all();



    return users;

}






// ==========================
// Modifier un utilisateur
// ==========================

export function updateUser(
    id,
    nom,
    prenom,
    password,
    role
) {



    // Vérifier si le mot de passe existe déjà
    const existingUser = db.prepare(`
        SELECT *
        FROM users
        WHERE password = ?
        AND id != ?
    `).get(
        password,
        id
    );



    if (existingUser) {

        return false;

    }




    const result = db.prepare(`
        UPDATE users
        SET nom = ?,
            prenom = ?,
            password = ?,
            role = ?
        WHERE id = ?
    `).run(
        nom,
        prenom,
        password,
        role,
        id
    );



    if (result.changes === 0) {

        return false;

    }



    return true;

}






// ==========================
// Supprimer un utilisateur
// ==========================

export function deleteUser(id) {



    // Chercher l'utilisateur
    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
    `).get(id);




    if (!user) {

        return false;

    }






    // Protection du dernier administrateur

    if (user.role === "admin") {



        const admins = db.prepare(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE role = 'admin'
        `).get();



        if (admins.total <= 1) {

            return false;

        }


    }






    const result = db.prepare(`
        DELETE FROM users
        WHERE id = ?
    `).run(id);





    if (result.changes === 0) {

        return false;

    }



    return true;

}







// ==========================
// Connexion utilisateur
// ==========================

export function findUserByLogin(
    nom,
    prenom,
    password
) {


    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE nom = ?
        AND prenom = ?
        AND password = ?
    `).get(
        nom,
        prenom,
        password
    );



    return user;

}