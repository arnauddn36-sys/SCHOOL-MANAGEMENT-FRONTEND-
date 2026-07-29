// public/js/ui.js
// Petit utilitaire d'interface partagé par tous les tableaux de bord :
// affiche une notification discrète en bas de l'écran au lieu d'un alert() bloquant,
// et échappe le texte injecté dans le HTML pour éviter les soucis d'affichage.

// Affiche une notification temporaire ("toast") en bas à droite de l'écran
export function showToast(message, type = "success") {

    let container = document.getElementById("toastContainer"); // Zone qui contient les toasts

    if (!container) {
        container = document.createElement("div");  // On crée la zone si elle n'existe pas encore
        container.id = "toastContainer";               // Identifiant pour la retrouver ensuite
        container.style.position = "fixed";              // Toujours visible, même en scrollant
        container.style.bottom = "20px";                   // Collé en bas de l'écran
        container.style.right = "20px";                      // Collé à droite de l'écran
        container.style.display = "flex";                       // Empile plusieurs toasts
        container.style.flexDirection = "column";                 // Direction verticale
        container.style.gap = "10px";                               // Espace entre les toasts
        container.style.zIndex = "1000";                              // Toujours au-dessus du reste
        document.body.appendChild(container);                          // Ajout dans la page
    }

    const toast = document.createElement("div"); // Le toast lui-même
    toast.textContent = message;                    // Texte du message
    toast.style.padding = "12px 18px";                // Espace intérieur
    toast.style.borderRadius = "8px";                   // Coins arrondis
    toast.style.color = "#ffffff";                        // Texte blanc
    toast.style.fontFamily = "Inter, sans-serif";           // Police lisible
    toast.style.fontSize = "14px";                            // Taille de texte
    toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";      // Ombre pour détacher le toast
    toast.style.backgroundColor = type === "error" ? "#c1443c" : "#4f7a63"; // Couleur selon le type

    container.appendChild(toast); // On affiche le toast

    setTimeout(() => toast.remove(), 3200); // Le toast disparaît automatiquement après 3,2s
}

// Échappe les caractères spéciaux HTML pour éviter d'injecter du code involontairement
export function escapeHtml(value) {

    const div = document.createElement("div"); // Élément temporaire jamais ajouté à la page
    div.textContent = value ?? "";                // On y place le texte brut
    return div.innerHTML;                          // Le navigateur nous rend la version échappée
}

// Demande une confirmation avant une action destructive (suppression)
export function confirmAction(message) {
    return window.confirm(message); // Simple confirmation native du navigateur
}
