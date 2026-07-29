// public/js/teacher.js
// Point d'entrée du tableau de bord professeur : affiche le profil du professeur
// connecté et permet de gérer les élèves, les notes et les absences.

import { requireRole, logout } from "./auth.js";
import { api } from "./api.js";
import { showToast, escapeHtml } from "./ui.js";
import { renderStudentsPanel } from "./panels/studentsPanel.js";
import { renderGradesPanel } from "./panels/gradesPanel.js";
import { renderAbsencesPanel } from "./panels/absencesPanel.js";

// On vérifie que la personne connectée est bien un professeur, sinon redirection
const user = requireRole("teacher");

if (user) {

    const content = document.getElementById("content"); // Zone d'affichage des panneaux

    document.getElementById("logout").addEventListener("click", logout); // Déconnexion

    // Association entre les boutons du menu et les panneaux à afficher
    const panels = {
        students: renderStudentsPanel,
        grades: renderGradesPanel,
        absences: renderAbsencesPanel
    };

    document.querySelectorAll(".teacher-menu button[data-panel]").forEach(button => {
        button.addEventListener("click", () => panels[button.dataset.panel](content));
    });

    loadProfile(); // Chargement du profil professeur au démarrage de la page
}

// Charge et affiche les informations du professeur connecté (nom + matières enseignées)
async function loadProfile() {

    try {

        const teacher = await api.get("/api/teachers/me"); // Profil lié au compte connecté

        document.getElementById("teacher-name").textContent = `${teacher.prenom} ${teacher.nom}`;

    } catch (error) {

        // Certains comptes professeur de démonstration n'ont pas de fiche liée : on l'indique simplement
        document.getElementById("teacher-name").textContent = `${user.prenom} ${user.nom}`;
        showToast("Aucune fiche professeur reliée à ce compte", "error");
    }
}
