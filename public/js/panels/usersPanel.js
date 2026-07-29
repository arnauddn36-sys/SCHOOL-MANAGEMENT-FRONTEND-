// public/js/panels/usersPanel.js
// Panneau "Gestion des utilisateurs" du tableau de bord administrateur.

import { api } from "../api.js";
import { showToast, escapeHtml, confirmAction } from "../ui.js";

// Point d'entrée du panneau : appelé quand l'admin clique sur "Utilisateurs"
export async function renderUsersPanel(container) {

    try {

        const users = await api.get("/api/users"); // Récupère tous les comptes
        renderList(container, users);                // Affiche la liste

    } catch (error) {
        console.error('Error loading users:', error);
        showToast("Impossible de charger les utilisateurs", "error");
        // Ne pas relancer l'erreur ici pour éviter d'interrompre le flux UI
        return;
    }
}

// Affiche le tableau des utilisateurs
function renderList(container, users) {

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>Gestion des utilisateurs</h2>
            <button id="addUserBtn">+ Ajouter un utilisateur</button>
        </div>

        ${users.length === 0 ? `
            <div class="empty-state">Aucun utilisateur enregistré pour le moment.</div>
        ` : `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(rowTemplate).join("")}
                </tbody>
            </table>
        `}
    `;

    // Bouton "Ajouter" -> affiche le formulaire de création
    container.querySelector("#addUserBtn")
        .addEventListener("click", () => renderForm(container));

    // Boutons "Modifier" de chaque ligne
    container.querySelectorAll(".edit-user").forEach(button => {
        button.addEventListener("click", () => renderForm(container, findUser(users, button.dataset.id)));
    });

    // Boutons "Supprimer" de chaque ligne
    container.querySelectorAll(".delete-user").forEach(button => {
        button.addEventListener("click", () => handleDelete(container, button.dataset.id));
    });
}

// Construit une ligne de tableau pour un utilisateur
function rowTemplate(user) {
    return `
        <tr>
            <td class="mono">${user.id}</td>
            <td>${escapeHtml(user.nom)}</td>
            <td>${escapeHtml(user.prenom)}</td>
            <td><span class="badge ok">${roleLabel(user.role)}</span></td>
            <td>
                <div class="row-actions">
                    <button class="secondary edit-user" data-id="${user.id}">Modifier</button>
                    <button class="danger delete-user" data-id="${user.id}">Supprimer</button>
                </div>
            </td>
        </tr>
    `;
}

// Traduit le rôle technique en libellé lisible
function roleLabel(role) {
    if (role === "admin") return "Administrateur";
    if (role === "teacher") return "Professeur";
    return "Élève";
}

// Retrouve un utilisateur dans la liste déjà chargée (évite un appel réseau supplémentaire)
function findUser(users, id) {
    return users.find(user => String(user.id) === String(id));
}

// Affiche le formulaire d'ajout (existingUser absent) ou de modification (existingUser fourni)
function renderForm(container, existingUser = null) {

    const isEdit = Boolean(existingUser); // true si on modifie un utilisateur existant

    container.innerHTML = `

        <div class="panel-toolbar">
            <h2>${isEdit ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>
            <button class="secondary" id="cancelUserBtn">Annuler</button>
        </div>

        <form id="userForm">

            <label for="userNom">Nom</label>
            <input type="text" id="userNom" value="${isEdit ? escapeHtml(existingUser.nom) : ""}" required>

            <label for="userPrenom">Prénom</label>
            <input type="text" id="userPrenom" value="${isEdit ? escapeHtml(existingUser.prenom) : ""}" required>

            <label for="userPassword">Mot de passe</label>
            <input type="text" id="userPassword" value="${isEdit ? escapeHtml(existingUser.password) : ""}" required>

            <label for="userRole">Rôle</label>
            <select id="userRole">
                <option value="admin"   ${isEdit && existingUser.role === "admin" ? "selected" : ""}>Administrateur</option>
                <option value="teacher" ${isEdit && existingUser.role === "teacher" ? "selected" : ""}>Professeur</option>
                <option value="student" ${isEdit && existingUser.role === "student" ? "selected" : ""}>Élève</option>
            </select>

            <button type="submit">${isEdit ? "Enregistrer" : "Ajouter"}</button>

        </form>
    `;

    // Retour à la liste sans enregistrer
    container.querySelector("#cancelUserBtn")
        .addEventListener("click", () => renderUsersPanel(container));

    // Soumission du formulaire (création ou modification selon le contexte)
    container.querySelector("#userForm")
        .addEventListener("submit", (event) => handleSubmit(event, container, isEdit ? existingUser.id : null));
}

// Envoie le formulaire au serveur (POST pour créer, PUT pour modifier)
async function handleSubmit(event, container, existingId) {

    event.preventDefault(); // On empêche le rechargement de la page

    const payload = {
        nom: document.getElementById("userNom").value.trim(),
        prenom: document.getElementById("userPrenom").value.trim(),
        password: document.getElementById("userPassword").value,
        role: document.getElementById("userRole").value
    };

    try {

        const result = existingId
            ? await api.put(`/api/users/${existingId}`, payload)  // Modification
            : await api.post("/api/users", payload);                // Création

        // Si l'API renvoie un flag d'erreur ou un statut non valide
        if (result && result.error) {
            showToast(result.message || "Une erreur est survenue", "error");
            return;
        }

        showToast(result.message || "Opération réussie"); // Message de succès renvoyé par le serveur
        await renderUsersPanel(container); // On revient à la liste actualisée

    } catch (error) {
        // Capture les erreurs HTTP (400, 500, etc.) rejetées par api.js
        console.error("Erreur soumission utilisateur :", error);
        showToast(error.message || "Ce mot de passe ou identifiant est déjà utilisé", "error");
    }
}

// Supprime un utilisateur après confirmation
async function handleDelete(container, id) {

    if (!confirmAction("Supprimer définitivement cet utilisateur ?")) {
        return; // L'admin a annulé
    }

    try {

        const result = await api.delete(`/api/users/${id}`);
        showToast(result.message);
        await renderUsersPanel(container); // Rafraîchit la liste

    } catch (error) {
        showToast(error.message || "Impossible de supprimer cet utilisateur", "error"); // Ex: dernier administrateur protégé
    }
}