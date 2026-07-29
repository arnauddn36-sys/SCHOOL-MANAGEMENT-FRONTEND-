// utils/permissions.js
// Ce fichier centralise le contrôle d'accès par rôle (RBAC) pour l'API Express.
// Le frontend envoie le rôle de l'utilisateur connecté dans l'en-tête "x-role"
// (voir public/js/api.js). Ce n'est pas un vrai système de sécurité (le rôle
// pourrait être falsifié par un utilisateur avancé), mais cela suffit pour ce
// projet pédagogique afin de distinguer clairement les vues admin / professeur / élève.

// Vérifie simplement qu'une requête vient d'un utilisateur connecté (rôle présent)
export function requireAuth(req, res, next) {
    const role = req.headers["x-role"]; // Rôle envoyé par le frontend après connexion

    if (!role) {
        return res.status(401).json({
            message: "Connexion requise"
        });
    }

    req.userRole = role;       // On stocke le rôle pour les prochains middlewares/contrôleurs
    req.userId = req.headers["x-user-id"] ? Number(req.headers["x-user-id"]) : null;
    next(); // On laisse passer la requête vers la suite
}

// Fabrique un middleware qui n'autorise que les rôles listés en paramètre
// Exemple : router.get("/", authorize("admin", "teacher"), getStudents);
export function authorize(...allowedRoles) {

    return function (req, res, next) {

        const role = req.headers["x-role"]; // Rôle transmis par le frontend

        if (!role) {
            return res.status(401).json({
                message: "Connexion requise"
            });
        }

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                message: "Accès refusé pour votre rôle"
            });
        }

        req.userRole = role; // Rôle disponible dans les contrôleurs suivants
        req.userId = req.headers["x-user-id"] ? Number(req.headers["x-user-id"]) : null;
        next(); // Rôle autorisé, on continue vers le contrôleur
    };
}
