// public/js/panels/statsPanel.js
// Panneau "Statistiques" du tableau de bord administrateur (lecture seule).

import { api } from "../api.js";
import { showToast, escapeHtml } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Statistiques"
export async function renderStatsPanel(container) {

    try {

        const stats = await api.get("/api/stats"); // Récupère les statistiques calculées côté serveur

        container.innerHTML = `

            <h2>Statistiques générales</h2>

            <div class="cards">

                <div class="card">
                    <h3>Utilisateurs</h3>
                    <p class="mono">${stats.utilisateurs}</p>
                </div>

                <div class="card">
                    <h3>Élèves</h3>
                    <p class="mono">${stats.eleves}</p>
                </div>

                <div class="card">
                    <h3>Professeurs</h3>
                    <p class="mono">${stats.professeurs}</p>
                </div>

                <div class="card">
                    <h3>Matières</h3>
                    <p class="mono">${stats.matieres}</p>
                </div>

                <div class="card">
                    <h3>Notes</h3>
                    <p class="mono">${stats.notes}</p>
                </div>

                <div class="card">
                    <h3>Absences</h3>
                    <p class="mono">${stats.absences}</p>
                </div>

                <div class="card">
                    <h3>Moyenne générale</h3>
                    <p class="mono">${stats.moyenneGenerale ? Number(stats.moyenneGenerale).toFixed(2) : "0"}/20</p>
                </div>

                <div class="card">
                    <h3>Meilleur élève</h3>
                    <p>
                        ${stats.meilleurEleve
                            ? `${escapeHtml(stats.meilleurEleve.nom)} ${escapeHtml(stats.meilleurEleve.prenom)}
                               <span class="mono">(${Number(stats.meilleurEleve.moyenne).toFixed(2)}/20)</span>`
                            : "Aucun"}
                    </p>
                </div>

            </div>
        `;

    } catch (error) {

        showToast("Impossible de charger les statistiques", "error");
    }
}
