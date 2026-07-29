import fs from "fs";
import path from "path";

const logDir = path.resolve("logs");
const logFile = path.join(logDir, "app.log");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "");
}

export function log(action, user = "SYSTEM") {
    const time = new Date().toISOString();
    const line = `[${time}] ${action} - ${user}\n`;

    fs.appendFileSync(logFile, line);
    console.log(line);
}