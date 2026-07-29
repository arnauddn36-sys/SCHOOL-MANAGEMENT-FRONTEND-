// public/js/login.js
// Gère la soumission du formulaire de connexion et la redirection vers le bon tableau de bord.

import { saveUser } from "./auth.js";

const loginForm = document.getElementById("loginForm");    // Le formulaire de connexion
const errorBox = document.getElementById("loginError");     // Zone d'affichage des erreurs

// Affiche un message d'erreur sous le formulaire
function showError(message) {
    errorBox.textContent = message; // On place le texte d'erreur
    errorBox.hidden = false;         // On rend la zone d'erreur visible
}

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault(); // Empêche le rechargement classique de la page

    errorBox.hidden = true; // On masque une éventuelle erreur précédente

    // Récupération des valeurs saisies par l'utilisateur
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const password = document.getElementById("password").value;

    if (nom === "" || prenom === "" || password === "") {
        showError("Veuillez remplir tous les champs.");
        return; // On arrête ici si un champ est vide
    }

    try {

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Pas encore de session ici
            body: JSON.stringify({ nom, prenom, password })    // Identifiants saisis
        });

        const result = await response.json(); // Réponse du serveur

        if (!result.success) {
            showError(result.message || "Identifiants incorrects.");
            return; // Connexion refusée par le serveur
        }

        saveUser(result.user); // On mémorise l'utilisateur connecté (id, nom, prenom, rôle)

        // Redirection vers le tableau de bord correspondant au rôle
        window.location.href = `/html/${result.user.role}.html`;

    } catch (error) {

        console.error("Erreur connexion :", error);
        showError("Impossible de contacter le serveur.");
    }
});
