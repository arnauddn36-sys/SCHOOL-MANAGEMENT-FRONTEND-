import { getStats } from "../services/statsService.js";



// ==========================
// Récupérer les statistiques
// ==========================

export function getStatistics(req, res) {

    try {

        const stats = getStats();

        res.json(stats);

    } catch (error) {

        console.error(
            "Erreur récupération statistiques :",
            error
        );

        res.status(500).json({

            message: "Erreur serveur"

        });

    }

}