// public/js/panels/gradesPanel.js
// Panneau "Gestion des notes" du tableau de bord administrateur (et professeur).

import { api } from "../api.js";
import { showToast, escapeHtml, confirmAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand on clique sur "Notes"
export async function renderGradesPanel(container) {

    try {

        const grades = await api.get("/api/grades"); // Récupère toutes les notes
        renderList(container, grades);                  // Affiche la liste

    } catch (error) {

        showToast("Impossible de charger les notes", "error");
    }
}

// Affiche le tableau des notes
function renderList(container, grades) {

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>Gestion des notes</h2>
            <button id="addGradeBtn">+ Ajouter une note</button>
        </div>

        ${grades.length === 0 ? `
            <div class="empty-state">Aucune note enregistrée pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Élève</th>
                        <th>Matière</th>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${grades.map(rowTemplate).join("")}
                </tbody>
            </table>
        `}
    `;

    container.querySelector("#addGradeBtn")
        .addEventListener("click", () => renderForm(container));

    container.querySelectorAll(".delete-grade").forEach(button => {
        button.addEventListener("click", () => handleDelete(container, button.dataset.id));
    });
}

// Construit une ligne de tableau pour une note
function rowTemplate(grade) {
    return `
        <tr>
            <td class="mono">${grade.id}</td>
            <td>${escapeHtml(grade.nom)} ${escapeHtml(grade.prenom)}</td>
            <td>${escapeHtml(grade.matiere)}</td>
            <td class="mono">${grade.note}/20</td>
            <td>
                <div class="row-actions">
                    <button class="danger delete-grade" data-id="${grade.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Affiche le formulaire d'ajout d'une note (avec listes déroulantes élèves/matières)
async function renderForm(container) {

    try {

        // On charge les élèves et les matières en parallèle pour remplir les listes déroulantes
        const [students, subjects] = await Promise.all([
            api.get("/api/students"),
            api.get("/api/subjects")
        ]);

        container.innerHTML = `

            <div class="panel-toolbar">
                <h2>Ajouter une note</h2>
                <button class="secondary" id="cancelGradeBtn">Annuler</button>
            </div>

            <form id="gradeForm">

                <label for="gradeStudent">Élève</label>
                <select id="gradeStudent">
                    ${students.map(student =>
                        `<option value="${student.id}">${escapeHtml(student.nom)} ${escapeHtml(student.prenom)}</option>`
                    ).join("")}
                </select>

                <label for="gradeSubject">Matière</label>
                <select id="gradeSubject">
                    ${subjects.map(subject =>
                        `<option value="${subject.id}">${escapeHtml(subject.nom)}</option>`
                    ).join("")}
                </select>

                <label for="gradeNote">Note (sur 20)</label>
                <input type="number" id="gradeNote" min="0" max="20" step="0.5" required>

                <button type="submit">Ajouter</button>

            </form>
        `;

        container.querySelector("#cancelGradeBtn")
            .addEventListener("click", () => renderGradesPanel(container));

        container.querySelector("#gradeForm")
            .addEventListener("submit", (event) => handleSubmit(event, container));

    } catch (error) {
        showToast("Impossible de charger les élèves ou les matières", "error");
    }
}

// Envoie le formulaire d'ajout au serveur
async function handleSubmit(event, container) {

    event.preventDefault();

    const payload = {
        student_id: Number(document.getElementById("gradeStudent").value),
        subject_id: Number(document.getElementById("gradeSubject").value),
        note: Number(document.getElementById("gradeNote").value)
    };

    try {

        const result = await api.post("/api/grades", payload);
        showToast(result.message);
        await renderGradesPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}

// Supprime une note après confirmation
async function handleDelete(container, id) {

    if (!confirmAction("Supprimer définitivement cette note ?")) {
        return;
    }

    try {

        const result = await api.delete(`/api/grades/${id}`);
        showToast(result.message);
        await renderGradesPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}
