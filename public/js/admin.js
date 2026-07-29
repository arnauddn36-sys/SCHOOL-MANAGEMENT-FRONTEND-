// public/js/admin.js
// Point d'entrée du tableau de bord administrateur : protège la page, affiche le
// nom de l'utilisateur, gère la déconnexion et bascule entre les différents panneaux.

import { requireRole, logout } from "./auth.js";
import { renderUsersPanel } from "./panels/usersPanel.js";
import { renderStudentsPanel } from "./panels/studentsPanel.js";
import { renderTeachersPanel } from "./panels/teachersPanel.js";
import { renderSubjectsPanel } from "./panels/subjectsPanel.js";
import { renderGradesPanel } from "./panels/gradesPanel.js";
import { renderAbsencesPanel } from "./panels/absencesPanel.js";
import { renderStatsPanel } from "./panels/statsPanel.js";

// On vérifie que la personne connectée est bien un administrateur, sinon redirection
const user = requireRole("admin");

if (user) {

    // Zone principale où chaque panneau est injecté
    const content = document.getElementById("content");

    // Affiche le nom de l'administrateur connecté dans le header
    document.getElementById("admin-name").textContent = `${user.prenom} ${user.nom}`;

    // Association entre l'identifiant d'un bouton de menu et la fonction qui l'affiche
    const panels = {
        users: renderUsersPanel,
        students: renderStudentsPanel,
        teachers: renderTeachersPanel,
        subjects: renderSubjectsPanel,
        grades: renderGradesPanel,
        absences: renderAbsencesPanel,
        stats: renderStatsPanel
    };

    // Ouvre un panneau donné et met à jour le bouton actif dans le menu
    function openPanel(panelName) {

        // On retire la classe "active" de tous les boutons du menu
        document.querySelectorAll(".admin-menu button").forEach(button => {
            button.classList.remove("active");
        });

        // On ajoute la classe "active" uniquement au bouton cliqué
        document.querySelector(`.admin-menu button[data-panel="${panelName}"]`)
            .classList.add("active");

        panels[panelName](content); // On affiche le panneau correspondant
    }

    // On relie chaque bouton du menu à l'ouverture de son panneau
    document.querySelectorAll(".admin-menu button[data-panel]").forEach(button => {
        button.addEventListener("click", () => openPanel(button.dataset.panel));
    });

    // Bouton de déconnexion dans le header
    document.getElementById("logout").addEventListener("click", logout);

    // Par défaut, on ouvre les statistiques à l'arrivée sur le tableau de bord
    openPanel("stats");
}
