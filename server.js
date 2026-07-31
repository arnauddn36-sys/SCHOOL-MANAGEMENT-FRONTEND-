// server.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";


import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import absenceRoutes from "./routes/absenceRoutes.js";
import { logger } from "./utils/logger.js";

// Création du serveur Express
const app = express();




// Gestion du chemin du projet
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Permet de récupérer les données des formulaires HTML
app.use(express.urlencoded({ extended: true }));


// Permet de recevoir des données JSON
app.use(express.json());



// Rend le dossier public accessible
app.use(express.static(path.join(__dirname, "public")));

// Routes de statistiques

app.use("/api/stats", statsRoutes);

// Routes des utilisateurs

app.use("/api/teachers", teacherRoutes);

// ROUTES

// Routes d'authentification
app.use("/api/auth", authRoutes);


app.use("/api/users", userRoutes);

// Routes des matières

app.use("/api/subjects", subjectRoutes);

// Routes des notes

app.use("/api/grades", gradeRoutes);

// Routes des élèves

app.use("/api/students", studentRoutes);

// Routes des absences

app.use("/api/absences", absenceRoutes);

// Route de test
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public/html/index.html")
    );

});



// Lancement du serveur
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur prêt :`);
    console.log(`- Sur ton PC  : http://localhost:${PORT}`);
    console.log(`- Sur ton tel :http://10.0.0.14:3${PORT}`);
});