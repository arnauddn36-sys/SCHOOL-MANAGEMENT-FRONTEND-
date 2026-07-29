// public/js/panels/subjectsPanel.js
// Panneau "Gestion des matières" du tableau de bord administrateur.

import { api } from "../api.js";
import { showToast, escapeHtml, confirmAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Matières"
export async function renderSubjectsPanel(container) {

    try {

        const subjects = await api.get("/api/subjects"); // Récupère toutes les matières
        renderList(container, subjects);                    // Affiche la liste

    } catch (error) {

        showToast("Impossible de charger les matières", "error");
    }
}

// Affiche le tableau des matières
function renderList(container, subjects) {

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>Gestion des matières</h2>
            <button id="addSubjectBtn">+ Ajouter une matière</button>
        </div>

        ${subjects.length === 0 ? `
            <div class="empty-state">Aucune matière enregistrée pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${subjects.map(rowTemplate).join("")}
                </tbody>
            </table>
        `}
    `;

    container.querySelector("#addSubjectBtn")
        .addEventListener("click", () => renderForm(container));

    container.querySelectorAll(".edit-subject").forEach(button => {
        button.addEventListener("click", () => renderForm(container, findSubject(subjects, button.dataset.id)));
    });

    container.querySelectorAll(".delete-subject").forEach(button => {
        button.addEventListener("click", () => handleDelete(container, button.dataset.id));
    });
}

// Construit une ligne de tableau pour une matière
function rowTemplate(subject) {
    return `
        <tr>
            <td class="mono">${subject.id}</td>
            <td>${escapeHtml(subject.nom)}</td>
            <td>
                <div class="row-actions">
                    <button class="secondary edit-subject" data-id="${subject.id}">Modifier</button>
                    <button class="danger delete-subject" data-id="${subject.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Retrouve une matière dans la liste déjà chargée
function findSubject(subjects, id) {
    return subjects.find(subject => String(subject.id) === String(id));
}

// Affiche le formulaire d'ajout ou de modification
function renderForm(container, existingSubject = null) {

    const isEdit = Boolean(existingSubject);

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>${isEdit ? "Modifier la matière" : "Ajouter une matière"}</h2>
            <button class="secondary" id="cancelSubjectBtn">Annuler</button>
        </div>

        <form id="subjectForm">

            <label for="subjectNom">Nom de la matière</label>
            <input type="text" id="subjectNom" value="${isEdit ? escapeHtml(existingSubject.nom) : ""}" required>

            <button type="submit">${isEdit ? "Enregistrer" : "Ajouter"}</button>

        </form>
    `;

    container.querySelector("#cancelSubjectBtn")
        .addEventListener("click", () => renderSubjectsPanel(container));

    container.querySelector("#subjectForm")
        .addEventListener("submit", (event) => handleSubmit(event, container, isEdit ? existingSubject.id : null));
}

// Envoie le formulaire au serveur (POST pour créer, PUT pour modifier)
async function handleSubmit(event, container, existingId) {

    event.preventDefault();

    const payload = {
        nom: document.getElementById("subjectNom").value.trim()
    };

    try {

        const result = existingId
            ? await api.put(`/api/subjects/${existingId}`, payload)
            : await api.post("/api/subjects", payload);

        showToast(result.message);
        await renderSubjectsPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}

// Supprime une matière après confirmation
async function handleDelete(container, id) {

    if (!confirmAction("Supprimer définitivement cette matière ?")) {
        return;
    }

    try {

        const result = await api.delete(`/api/subjects/${id}`);
        showToast(result.message);
        await renderSubjectsPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}
