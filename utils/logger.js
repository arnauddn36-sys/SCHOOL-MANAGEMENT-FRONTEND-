import fs from "fs";
import path from "path";

const logFolder = "./logs";
const logFile = path.join(logFolder, "app.log");

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
}

// Fonction de journalisation
export function logger(message) {

    const date = new Date().toLocaleString();

    const text = `[${date}] ${message}\n`;

    fs.appendFileSync(logFile, text);

}