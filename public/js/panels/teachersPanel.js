// public/js/panels/teachersPanel.js
// Panneau "Gestion des professeurs" du tableau de bord administrateur.

import { api } from "../api.js";
import { showToast, escapeHtml, confirmAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Professeurs"
export async function renderTeachersPanel(container) {

    try {

        const teachers = await api.get("/api/teachers"); // Récupère tous les professeurs
        renderList(container, teachers);                    // Affiche la liste

    } catch (error) {

        showToast("Impossible de charger les professeurs", "error");
    }
}

// Affiche le tableau des professeurs
function renderList(container, teachers) {

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>Gestion des professeurs</h2>
            <button id="addTeacherBtn">+ Ajouter un professeur</button>
        </div>

        ${teachers.length === 0 ? `
            <div class="empty-state">Aucun professeur enregistré pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Matières</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${teachers.map(rowTemplate).join("")}
                </tbody>
            </table>
        `}
    `;

    container.querySelector("#addTeacherBtn")
        .addEventListener("click", () => renderForm(container));

    container.querySelectorAll(".assign-subject").forEach(button => {
        button.addEventListener("click", () => renderAssignForm(container, button.dataset.id));
    });

    container.querySelectorAll(".delete-teacher").forEach(button => {
        button.addEventListener("click", () => handleDelete(container, button.dataset.id));
    });
}

// Construit une ligne de tableau pour un professeur
function rowTemplate(teacher) {
    return `
        <tr>
            <td class="mono">${teacher.id}</td>
            <td>${escapeHtml(teacher.nom)}</td>
            <td>${escapeHtml(teacher.prenom)}</td>
            <td>${teacher.matieres.length > 0 ? teacher.matieres.map(escapeHtml).join(", ") : "Aucune"}</td>
            <td>
                <div class="row-actions">
                    <button class="secondary assign-subject" data-id="${teacher.id}">Attribuer matière</button>
                    <button class="danger delete-teacher" data-id="${teacher.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Affiche le formulaire d'ajout d'un professeur
function renderForm(container) {

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>Ajouter un professeur</h2>
            <button class="secondary" id="cancelTeacherBtn">Annuler</button>
        </div>

        <form id="teacherForm">

            <label for="teacherNom">Nom</label>
            <input type="text" id="teacherNom" required>

            <label for="teacherPrenom">Prénom</label>
            <input type="text" id="teacherPrenom" required>

            <button type="submit">Ajouter</button>

        </form>
    `;

    container.querySelector("#cancelTeacherBtn")
        .addEventListener("click", () => renderTeachersPanel(container));

    container.querySelector("#teacherForm")
        .addEventListener("submit", (event) => handleSubmit(event, container));
}

// Envoie le formulaire d'ajout au serveur
async function handleSubmit(event, container) {

    event.preventDefault();

    const payload = {
        nom: document.getElementById("teacherNom").value.trim(),
        prenom: document.getElementById("teacherPrenom").value.trim()
    };

    try {

        const result = await api.post("/api/teachers", payload);
        showToast(result.message);
        await renderTeachersPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}

// Affiche le formulaire d'attribution d'une matière à un professeur
async function renderAssignForm(container, teacherId) {

    try {

        const subjects = await api.get("/api/subjects"); // Liste des matières disponibles

        container.innerHTML = `

            <div class="panel-toolbar">
                <h2>Attribuer une matière</h2>
                <button class="secondary" id="cancelAssignBtn">Annuler</button>
            </div>

            <form id="assignForm">

                <label for="assignSubject">Matière</label>
                <select id="assignSubject">
                    ${subjects.map(subject => `<option value="${subject.id}">${escapeHtml(subject.nom)}</option>`).join("")}
                </select>

                <button type="submit">Attribuer</button>

            </form>
        `;

        container.querySelector("#cancelAssignBtn")
            .addEventListener("click", () => renderTeachersPanel(container));

        container.querySelector("#assignForm")
            .addEventListener("submit", (event) => handleAssign(event, container, teacherId));

    } catch (error) {
        showToast("Impossible de charger les matières", "error");
    }
}

// Envoie l'attribution de matière au serveur
async function handleAssign(event, container, teacherId) {

    event.preventDefault();

    const subjectId = document.getElementById("assignSubject").value;

    try {

        const result = await api.put("/api/teachers/assign-subject", {
            teacherId: Number(teacherId),
            subjectId: Number(subjectId)
        });

        showToast(result.message);
        await renderTeachersPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}

// Supprime un professeur après confirmation
async function handleDelete(container, id) {

    if (!confirmAction("Supprimer définitivement ce professeur ?")) {
        return;
    }

    try {

        const result = await api.delete(`/api/teachers/${id}`);
        showToast(result.message);
        await renderTeachersPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}
