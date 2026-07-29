// public/js/api.js
// Module partagé qui centralise tous les appels à l'API. Il ajoute automatiquement
// les en-têtes "x-role" et "x-user-id" utilisés par le middleware RBAC du serveur
// (voir utils/permissions.js), pour éviter de le répéter dans chaque panneau.

import { getUser, logout } from "./auth.js";

// Construit les en-têtes communs à chaque requête (JSON + identité de l'utilisateur)
function buildHeaders() {

    const user = getUser(); // Utilisateur actuellement connecté

    const headers = {
        "Content-Type": "application/json" // Le corps des requêtes est toujours du JSON
    };

    if (user) {
        headers["x-role"] = user.role;      // Rôle transmis pour le contrôle d'accès serveur
        headers["x-user-id"] = user.id;      // Id transmis pour les routes "/me"
    }

    return headers;
}

// Fonction interne qui exécute la requête et gère les erreurs communes
async function request(url, options = {}) {

    const response = await fetch(url, {
        ...options,                 // Méthode, corps, etc. fournis par l'appelant
        headers: buildHeaders()     // En-têtes d'authentification ajoutés automatiquement
    });

    if (response.status === 401) {
        logout(); // Session invalide -> on renvoie vers la connexion
        return null;
    }

    const data = await response.json().catch(() => null); // On tente de lire le JSON

    if (!response.ok) {
        // On transforme les erreurs HTTP en erreurs JS classiques, avec le message serveur
        throw new Error(data?.message || "Erreur serveur");
    }

    return data; // Résultat exploitable par l'appelant
}

// Raccourcis pour chaque verbe HTTP utilisé dans l'application
export const api = {
    get:    (url)       => request(url, { method: "GET" }),
    post:   (url, body) => request(url, { method: "POST", body: JSON.stringify(body) }),
    put:    (url, body) => request(url, { method: "PUT", body: JSON.stringify(body) }),
    delete: (url)        => request(url, { method: "DELETE" })
};
