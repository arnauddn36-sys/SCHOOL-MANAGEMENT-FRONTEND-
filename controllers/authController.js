// controllers/authController.js

import { findUserByLogin } from "../services/userService.js";


// CONNEXION UTILISATEUR

export function login(req, res) {


    try {


        const { nom, prenom, password } = req.body;



        // Vérifier les champs
        if (!nom || !prenom || !password) {

            return res.status(400).send(
                "Veuillez remplir tous les champs"
            );

        }



        // Recherche utilisateur via userService
        const user = findUserByLogin(
            nom,
            prenom,
            password
        );



        // Si utilisateur introuvable
        if (!user) {

            return res.status(401).send(
                "Nom, prénom ou mot de passe incorrect"
            );

        }



        // Redirection selon le rôle

       // Réponse envoyée au frontend

return res.json({

    success: true,

    message: "Connexion réussie",

    // On renvoie l'utilisateur (sans le mot de passe) pour que le frontend
    // puisse afficher son nom et l'utiliser pour les futures requêtes (rôle, id).
    user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
    }

});



    } catch (error) {


        console.error(
            "Erreur connexion :",
            error
        );


        return res.status(500).send(
            "Erreur serveur"
        );


    }

}