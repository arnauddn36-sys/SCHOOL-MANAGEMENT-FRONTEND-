// public/js/panels/studentsPanel.js
// Panneau "Gestion des élèves" du tableau de bord administrateur.

import { api } from "../api.js";
import { showToast, escapeHtml, confirmAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Élèves"
export async function renderStudentsPanel(container) {

    try {

        const students = await api.get("/api/students"); // Récupère tous les élèves
        renderList(container, students);                    // Affiche la liste

    } catch (error) {

        showToast("Impossible de charger les élèves", "error");
    }
}

// Affiche le tableau des élèves
function renderList(container, students) {

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>Gestion des élèves</h2>
            <button id="addStudentBtn">+ Ajouter un élève</button>
        </div>

        ${students.length === 0 ? `
            <div class="empty-state">Aucun élève enregistré pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Âge</th>
                        <th>Classe</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(rowTemplate).join("")}
                </tbody>
            </table>
        `}
    `;

    container.querySelector("#addStudentBtn")
        .addEventListener("click", () => renderForm(container));

    container.querySelectorAll(".edit-student").forEach(button => {
        button.addEventListener("click", () => renderForm(container, findStudent(students, button.dataset.id)));
    });

    container.querySelectorAll(".delete-student").forEach(button => {
        button.addEventListener("click", () => handleDelete(container, button.dataset.id));
    });
}

// Construit une ligne de tableau pour un élève
function rowTemplate(student) {
    return `
        <tr>
            <td class="mono">${escapeHtml(student.matricule)}</td>
            <td>${escapeHtml(student.nom)}</td>
            <td>${escapeHtml(student.prenom)}</td>
            <td>${student.age}</td>
            <td>${escapeHtml(student.classe)}</td>
            <td>
                <div class="row-actions">
                    <button class="secondary edit-student" data-id="${student.id}">Modifier</button>
                    <button class="danger delete-student" data-id="${student.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Retrouve un élève dans la liste déjà chargée
function findStudent(students, id) {
    return students.find(student => String(student.id) === String(id));
}

// Affiche le formulaire d'ajout ou de modification
function renderForm(container, existingStudent = null) {

    const isEdit = Boolean(existingStudent);

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>${isEdit ? "Modifier l'élève" : "Ajouter un élève"}</h2>
            <button class="secondary" id="cancelStudentBtn">Annuler</button>
        </div>

        <form id="studentForm">

            <label for="studentMatricule">Matricule</label>
            <input type="text" id="studentMatricule" value="${isEdit ? escapeHtml(existingStudent.matricule) : ""}" required>

            <label for="studentNom">Nom</label>
            <input type="text" id="studentNom" value="${isEdit ? escapeHtml(existingStudent.nom) : ""}" required>

            <label for="studentPrenom">Prénom</label>
            <input type="text" id="studentPrenom" value="${isEdit ? escapeHtml(existingStudent.prenom) : ""}" required>

            <label for="studentAge">Âge</label>
            <input type="number" id="studentAge" min="3" max="30" value="${isEdit ? existingStudent.age : ""}" required>

            <label for="studentClasse">Classe</label>
            <input type="text" id="studentClasse" value="${isEdit ? escapeHtml(existingStudent.classe) : ""}" required>

            <button type="submit">${isEdit ? "Enregistrer" : "Ajouter"}</button>

        </form>
    `;

    container.querySelector("#cancelStudentBtn")
        .addEventListener("click", () => renderStudentsPanel(container));

    container.querySelector("#studentForm")
        .addEventListener("submit", (event) => handleSubmit(event, container, isEdit ? existingStudent.id : null));
}

// Envoie le formulaire au serveur (POST pour créer, PUT pour modifier)
async function handleSubmit(event, container, existingId) {

    event.preventDefault();

    const payload = {
        matricule: document.getElementById("studentMatricule").value.trim(),
        nom: document.getElementById("studentNom").value.trim(),
        prenom: document.getElementById("studentPrenom").value.trim(),
        age: Number(document.getElementById("studentAge").value),
        classe: document.getElementById("studentClasse").value.trim()
    };

    try {

        const result = existingId
            ? await api.put(`/api/students/${existingId}`, payload)
            : await api.post("/api/students", payload);

        showToast(result.message);
        await renderStudentsPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}

// Supprime un élève après confirmation
async function handleDelete(container, id) {

    if (!confirmAction("Supprimer définitivement cet élève ?")) {
        return;
    }

    try {

        const result = await api.delete(`/api/students/${id}`);
        showToast(result.message);
        await renderStudentsPanel(container);

    } catch (error) {
        showToast(error.message, "error");
    }
}
