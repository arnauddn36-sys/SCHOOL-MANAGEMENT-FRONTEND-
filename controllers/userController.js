// controllers/userController.js

import {
    listUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserById
} from "../services/userService.js";

// ==========================
// Afficher les utilisateurs
// ==========================
export function getUsers(req, res) {
    try {
        const users = listUsers();
        res.json(users);
    } catch (error) {
        console.error(
            "Erreur récupération utilisateurs :",
            error
        );
        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Afficher un utilisateur par ID
// ==========================
export function getUser(req, res) {
    try {
        const id = req.params.id;
        const user = getUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        res.json(user);
    } catch (error) {
        console.error(
            "Erreur récupération utilisateur :",
            error
        );
        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Ajouter un utilisateur
// ==========================
export function createUser(req, res) {
    try {
        const {
            nom,
            prenom,
            password,
            role
        } = req.body;

        if (!nom || !prenom || !password || !role) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }

        // On vérifie le résultat du service avant de répondre
        const result = addUser(
            nom,
            prenom,
            password,
            role
        );

        if (!result) {
            return res.status(400).json({
                message: "Ce mot de passe est déjà utilisé, saisissez-en un autre !"
            });
        }

        res.json({
            message: "Utilisateur ajouté avec succès"
        });

    } catch (error) {
        console.error(
            "Erreur ajout utilisateur :",
            error
        );
        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Modifier un utilisateur
// ==========================
export function editUser(req, res) {
    try {
        const id = req.params.id;
        const {
            nom,
            prenom,
            password,
            role
        } = req.body;

        const result = updateUser(
            id,
            nom,
            prenom,
            password,
            role
        );

        if (!result) {
            return res.status(400).json({
                message: "Ce mot de passe est déjà utilisé, saisissez-en un autre !"
            });
        }

        res.json({
            message: "Utilisateur modifié avec succès"
        });

    } catch (error) {
        console.error(
            "Erreur modification utilisateur :",
            error
        );
        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}

// ==========================
// Supprimer un utilisateur
// ==========================
export function removeUser(req, res) {
    try {
        const id = req.params.id;
        const result = deleteUser(id);

        if (!result) {
            return res.status(400).json({
                message: "Suppression impossible (dernier administrateur ou utilisateur introuvable)"
            });
        }

        res.json({
            message: "Utilisateur supprimé avec succès"
        });

    } catch (error) {
        console.error(
            "Erreur suppression utilisateur :",
            error
        );

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}