// public/js/student.js
// Point d'entrée du tableau de bord élève : affiche la fiche d'identité,
// les notes et les absences de l'élève connecté (lecture seule).

import { requireRole, logout } from "./auth.js";
import { api } from "./api.js";
import { showToast, escapeHtml } from "./ui.js";

// On vérifie que la personne connectée est bien un élève, sinon redirection
const user = requireRole("student");

if (user) {

    document.getElementById("logout").addEventListener("click", logout); // Déconnexion
    loadProfile(); // Chargement des informations de l'élève au démarrage de la page
}

// Charge le profil complet de l'élève (infos + notes + absences) et remplit la page
async function loadProfile() {

    try {

        const profile = await api.get("/api/students/me"); // Profil lié au compte connecté

        renderIdentity(profile);          // Affiche la fiche d'identité
        renderGrades(profile.grades);      // Affiche le tableau des notes
        renderAbsences(profile.absences);  // Affiche le tableau des absences

    } catch (error) {

        showToast("Aucune fiche élève reliée à ce compte", "error");
    }
}

// Remplit la fiche d'identité (nom, prénom, classe, matricule)
function renderIdentity(profile) {

    document.getElementById("student-name").textContent = `${profile.prenom} ${profile.nom}`;
    document.getElementById("info-nom").textContent = profile.nom;
    document.getElementById("info-prenom").textContent = profile.prenom;
    document.getElementById("info-classe").textContent = profile.classe;
    document.getElementById("info-matricule").textContent = profile.matricule;
}

// Construit le tableau des notes de l'élève
function renderGrades(grades) {

    const tbody = document.getElementById("gradesBody"); // Corps du tableau des notes

    if (grades.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2">Aucune note pour le moment.</td></tr>`;
        return;
    }

    tbody.innerHTML = grades.map(grade => `
        <tr>
            <td>${escapeHtml(grade.matiere)}</td>
            <td class="mono">${grade.note}/20</td>
        </tr>
    `).join("");
}

// Construit le tableau des absences de l'élève
function renderAbsences(absences) {

    const tbody = document.getElementById("absencesBody"); // Corps du tableau des absences

    if (absences.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2">Aucune absence enregistrée.</td></tr>`;
        return;
    }

    tbody.innerHTML = absences.map(absence => `
        <tr>
            <td class="mono">${absence.date}</td>
            <td><span class="badge ${absence.status === "Justifié" ? "ok" : "warn"}">${escapeHtml(absence.status)}</span></td>
        </tr>
    `).join("");
}
