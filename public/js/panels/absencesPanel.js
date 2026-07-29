// public/js/panels/absencesPanel.js
// Panneau "Gestion des absences" du tableau de bord administrateur (et professeur).

import { api } from "../api.js";
import { showToast, escapeHtml, confirmAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand on clique sur "Absences"
export async function renderAbsencesPanel(container) {

    try {

        const absences = await api.get("/api/absences"); // Récupère toutes les absences
        renderList(container, absences);                    // Affiche la liste

    } catch (error) {

        console.error(error);
        showToast(`Impossible de charger les absences : ${error.message || error}`, "error");
    }
}

// Affiche le tableau des absences
function renderList(container, absences) {

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>Gestion des absences</h2>
            <button id="addAbsenceBtn">+ Ajouter une absence</button>
        </div>

        ${absences.length === 0 ? `
            <div class="empty-state">Aucune absence enregistrée pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>Élève</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${absences.map(rowTemplate).join("")}
                </tbody>
            </table>
        `}
    `;

    container.querySelector("#addAbsenceBtn")
        .addEventListener("click", () => renderForm(container));

    container.querySelectorAll(".delete-absence").forEach(button => {
        button.addEventListener("click", () => handleDelete(container, button.dataset.id));
    });
}

// Construit une ligne de tableau pour une absence
function rowTemplate(absence) {

    const isJustified = absence.status === "Justifié"; // Détermine la couleur du badge

    return `
        <tr>
            <td>${escapeHtml(absence.nom)} ${escapeHtml(absence.prenom)}</td>
            <td class="mono">${absence.date}</td>
            <td><span class="badge ${isJustified ? "ok" : "warn"}">${escapeHtml(absence.status)}</span></td>
            <td>
                <div class="row-actions">
                    <button class="danger delete-absence" data-id="${absence.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Affiche le formulaire d'ajout d'une absence
async function renderForm(container) {

    try {

        const students = await api.get("/api/students"); // Liste des élèves pour le menu déroulant

        container.innerHTML = `

            <div class="panel-toolbar">
                <h2>Ajouter une absence</h2>
                <button class="secondary" id="cancelAbsenceBtn">Annuler</button>
            </div>

            <form id="absenceForm">

                <label for="absenceStudent">Élève</label>
                <select id="absenceStudent">
                    ${students.map(student =>
            `<option value="${student.id}">${escapeHtml(student.nom)} ${escapeHtml(student.prenom)}</option>`
        ).join("")}
                </select>

                <label for="absenceDate">Date</label>
                <input type="date" id="absenceDate" required>

                <label for="absenceStatus">Statut</label>
                <select id="absenceStatus">
                    <option value="Justifié">Justifié</option>
                    <option value="Non-justifié">Non-justifié</option>
                </select>

                <button type="submit">Ajouter</button>

            </form>
        `;

        container.querySelector("#cancelAbsenceBtn")
            .addEventListener("click", () => renderAbsencesPanel(container));

        container.querySelector("#absenceForm")
            .addEventListener("submit", (event) => handleSubmit(event, container));

    } catch (error) {
        showToast("Impossible de charger les élèves", "error");
    }
}

// Envoie le formulaire d'ajout au serveur
async function handleSubmit(event, container) {

    event.preventDefault();

    const payload = {
        student_id: Number(document.getElementById("absenceStudent").value),
        date: document.getElementById("absenceDate").value,
        status: document.getElementById("absenceStatus").value
    };

    try {

        const result = await api.post("/api/absences", payload);
        showToast(result.message);
        await renderAbsencesPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}

// Supprime une absence après confirmation
async function handleDelete(container, id) {

    if (!confirmAction("Supprimer définitivement cette absence ?")) {
        return;
    }

    try {

        const result = await api.delete(`/api/absences/${id}`);
        showToast(result.message);
        await renderAbsencesPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}
