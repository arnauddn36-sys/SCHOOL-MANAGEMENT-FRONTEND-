// public/js/auth.js
// Module partagé qui gère la session de l'utilisateur connecté côté navigateur.
// On utilise localStorage (et non un vrai système de session serveur) car ce
// projet n'a pas de gestion de token : c'est suffisant pour un projet pédagogique.

const STORAGE_KEY = "schoolManagementUser"; // Clé utilisée dans le localStorage

// Enregistre l'utilisateur connecté après un login réussi
export function saveUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); // On sérialise l'objet en texte
}

// Récupère l'utilisateur actuellement connecté (ou null si personne n'est connecté)
export function getUser() {
    const raw = localStorage.getItem(STORAGE_KEY); // On lit la chaîne stockée

    if (!raw) {
        return null; // Aucun utilisateur enregistré
    }

    try {
        return JSON.parse(raw); // On reconvertit le texte en objet JavaScript
    } catch {
        return null; // Donnée corrompue : on considère qu'il n'y a pas d'utilisateur
    }
}

// Supprime la session (utilisé lors de la déconnexion)
export function clearUser() {
    localStorage.removeItem(STORAGE_KEY); // On efface l'entrée du localStorage
}

// Protège une page : redirige vers la connexion si personne n'est connecté,
// ou vers le bon tableau de bord si le rôle ne correspond pas à la page.
export function requireRole(expectedRole) {

    const user = getUser(); // On récupère la session actuelle

    if (!user) {
        window.location.href = "/html/index.html"; // Pas connecté -> retour au login
        return null;
    }

    if (user.role !== expectedRole) {
        window.location.href = `/html/${user.role}.html`; // Mauvais tableau de bord -> le bon
        return null;
    }

    return user; // Utilisateur valide pour cette page
}

// Déconnecte l'utilisateur et le renvoie vers la page de connexion
export function logout() {
    clearUser();                             // On efface la session locale
    window.location.href = "/html/index.html"; // On revient à l'écran de connexion
}
