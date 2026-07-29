// db/database.js
// Ce fichier crée la base de données SQLite et la remplit avec des données de démonstration.

import Database from "better-sqlite3"; // Driver SQLite synchrone pour Node.js

const db = new Database("database.db"); // Ouvre (ou crée) le fichier database.db

db.pragma("foreign_keys = ON"); // Active la vérification des clés étrangères

// ==========================
// RESET DEVELOPPEMENT
// ==========================
// On supprime les tables à chaque démarrage pour repartir sur une base propre en développement.
db.exec(`
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS absences;
DROP TABLE IF EXISTS teacher_subjects;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;
`);

// ==========================
// USERS
// ==========================
// Table centrale de connexion : chaque compte (admin, professeur, élève) est un user.
db.exec(`
CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    password TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL
);
`);

const insertUsers = db.prepare(`
INSERT INTO users(nom, prenom, password, role)
VALUES(?,?,?,?)
`); // Requête préparée pour insérer un utilisateur

insertUsers.run("Den", "Arnaud", "0123", "admin");     // Compte administrateur de démonstration
insertUsers.run("Bob", "LeBon", "1234", "teacher");    // Compte professeur de démonstration
insertUsers.run("Jean", "Martin", "0000", "student");  // Compte élève de démonstration

// ==========================
// STUDENTS
// ==========================
// user_id relie (optionnellement) un élève à son compte de connexion (role = student).
db.exec(`
CREATE TABLE students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricule TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    age INTEGER NOT NULL,
    classe TEXT NOT NULL,
    user_id INTEGER UNIQUE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);
`);

const insertStudents = db.prepare(`
INSERT INTO students(matricule, nom, prenom, age, classe, user_id)
VALUES(?,?,?,?,?,?)
`);

insertStudents.run("MAT-2026-021", "Kouadio", "Menelick", 18, "1er A1", null); // Élève sans compte lié
insertStudents.run("MAT-2026-022", "Diallo", "Amoin", 19, "1er A1", null);     // Élève sans compte lié
insertStudents.run("MAT-2026-023", "Martin", "Jean", 17, "1er A1", 3);         // Lié au compte élève (user id 3)

// ==========================
// TEACHERS
// ==========================
// user_id relie (optionnellement) un professeur à son compte de connexion (role = teacher).
db.exec(`
CREATE TABLE teachers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    user_id INTEGER UNIQUE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);
`);

const insertTeachers = db.prepare(`
INSERT INTO teachers(nom, prenom, user_id)
VALUES(?,?,?)
`);

insertTeachers.run("Bon", "Bob", 2);            // Professeur lié au compte "Bob LeBon" (user id 2)
insertTeachers.run("Dramane", "Schella", null); // Professeur sans compte de connexion

// ==========================
// SUBJECTS
// ==========================
db.exec(`
CREATE TABLE subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE
);
`);

const insertSubjects = db.prepare(`
INSERT INTO subjects(nom)
VALUES(?)
`);

insertSubjects.run("Mathématiques"); // Matière 1
insertSubjects.run("Français");      // Matière 2

// ==========================
// RELATION PROFESSEUR - MATIERE
// ==========================
db.exec(`
CREATE TABLE teacher_subjects(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
`);

const insertTeacherSubject = db.prepare(`
INSERT INTO teacher_subjects(teacher_id, subject_id)
VALUES(?,?)
`);

insertTeacherSubject.run(1, 1); // Bob Bon enseigne les Mathématiques
insertTeacherSubject.run(2, 2); // Dramane Schella enseigne le Français

// ==========================
// GRADES
// ==========================
db.exec(`
CREATE TABLE grades(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    note REAL NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
`);

const insertGrades = db.prepare(`
INSERT INTO grades(student_id, subject_id, note)
VALUES(?,?,?)
`);

insertGrades.run(1, 1, 15.5); // Note de Kouadio Menelick en Mathématiques
insertGrades.run(2, 2, 16);   // Note de Diallo Amoin en Français
insertGrades.run(3, 1, 12.5); // Note de Jean Martin en Mathématiques

// ==========================
// ABSENCES
// ==========================
db.exec(`
CREATE TABLE absences(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);
`);

const nowDate = new Date().toISOString().split("T")[0]; // Date du jour au format AAAA-MM-JJ

const insertAbsences = db.prepare(`
INSERT INTO absences(student_id, date, status)
VALUES(?,?,?)
`);

insertAbsences.run(1, nowDate, "Justifié");     // Absence justifiée de Kouadio Menelick
insertAbsences.run(3, nowDate, "Non-justifié"); // Absence non justifiée de Jean Martin

// EXPORT
export default db; // On exporte la connexion pour l'utiliser dans les services
