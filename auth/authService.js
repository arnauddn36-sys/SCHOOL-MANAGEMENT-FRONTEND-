import db from "../db/database.js";
import { log } from "../utils/logger.js";

export function login(nom, prenom, password) {
    const user = db.prepare(`
        SELECT id, nom, prenom, role
        FROM users
        WHERE nom = ? AND prenom = ? AND password = ?
    `).get(nom, prenom, password);

    if (user) {
        log("LOGIN_SUCCESS", `${nom} ${prenom}`);
    } else {
        log("LOGIN_FAILED", `${nom} ${prenom}`);
    }

    return user;
}