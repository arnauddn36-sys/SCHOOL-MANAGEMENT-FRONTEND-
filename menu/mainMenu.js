// IMPORTS

// fonction utilitaire pour poser des questions dans le terminal
import { ask } from "../utils/ask.js";

// services étudiants (CRUD étudiants)
import {
    addStudent, listStudents, getStudentById, updateStudent, deleteStudent
} from "../services/studentService.js";

// services enseignants (CRUD enseignants)
import {
    addTeacher, listTeachers, getTeacherById, updateTeacher, deleteTeacher
} from "../services/teacherService.js";

// services matières (CRUD matières)
import {
    addSubject, listSubjects, getSubjectById, updateSubject, deleteSubject
} from "../services/subjectService.js";

// services notes (CRUD notes)
import {
    addGrade, listGrades, getGradeById, updateGrade, deleteGrade
} from "../services/gradeService.js";

// services statistiques (calculs globaux)
import {
    getGeneralAverage, getBestStudent, countAbsences
} from "../services/statsService.js";

import { addUser, listUsers, getUserById, updateUser, deleteUser } 
from "../services/userService.js";

/// MENU PRINCIPAL
export async function showMainMenu(user) {
    console.clear();

    console.log(`
SCHOOL MANAGEMENT

User: ${user.nom} ${user.prenom} (${user.role})
`);

    const options = [];
    options.push("1 - Étudiants");
    if (user.role === "admin") {
    options.push("2 - Gestion des utilisateurs");
    }
    options.push("3 - Matières");
    options.push("4 - Notes");
    options.push("5 - Absences");
    options.push("6 - Statistiques");

    options.push("0 - Quitter");

    console.log(options.join("\n"));

    const choice = await ask("\nChoix : ");
    await handleMainMenu(choice, user);
}

// MENU ADMIN

async function showAdminMenu(user) {
    console.clear();

    console.log(`
===== GESTION DES UTILISATEURS =====

1 - Ajouter un utilisateur
2 - Modifier un utilisateur
3 - Lister les utilisateurs
4 - Supprimer un utilisateur
0 - Retour
`);

    const choice = await ask("Choix : ");

    switch (choice.trim()) {
       case "1": {
    const nom = await ask("Nom : ");
    const prenom = await ask("Prénom : ");
    const password = await ask("Mot de passe : ");
    const role = await ask("Rôle (admin/teacher/student) : ");

    addUser(nom, prenom, password, role);
    break;
}

       case "2": {
    const id = await ask("ID de l'utilisateur : ");
    const nom = await ask("Nouveau nom : ");
    const prenom = await ask("Nouveau prénom : ");
    const password = await ask("Nouveau mot de passe : ");
    const role = await ask("Nouveau rôle : ");

    updateUser(
        Number(id),
        nom,
        prenom,
        password,
        role
    );
    break;
}

        case "3":
            listUsers();
            break;

        case "4": {
    const id = await ask("ID de l'utilisateur à supprimer : ");
    deleteUser(Number(id));
    break;
}
        case "0":
            return showMainMenu(user);

        default:
            console.log("Choix invalide");
    }

    await ask("\nAppuyez sur Entrée pour continuer...");
    return showAdminMenu(user);
}



// MENU ÉTUDIANTS

async function showStudentMenu(user) {
    console.log(`
ÉTUDIANTS
1 - Ajouter
2 - Lister
3 - Voir par ID
4 - Modifier
5 - Supprimer
0 - Retour
    `);

    const choice = await ask("Choix : ");
    await handleStudentMenu(choice, user);
}

async function handleStudentMenu(choice, user){
    if (
        (user.role === "teacher" || user.role === "student") &&
        ["1", "4", "5"].includes(choice)
    ) {
        console.log("Accès refusé (lecture seule)");
        return showStudentMenu(user);
    }

    switch (choice.trim()) {
        case "1": {
            const m = await ask("Matricule: ");
            const n = await ask("Nom: ");
            const p = await ask("Prénom: ");
            const a = await ask("Âge: ");
            const c = await ask("Classe: ");
            addStudent(m, n, p, Number(a), c);
            break;
        }
        case "2":
            listStudents();
            break;
        case "3": {
            const id = await ask("ID: ");
            getStudentById(Number(id));
            break;
        }
        case "4": {
            const id = await ask("ID: ");
            const m = await ask("Matricule: ");
            const n = await ask("Nom: ");
            const p = await ask("Prénom: ");
            const a = await ask("Âge: ");
            const c = await ask("Classe: ");
            updateStudent(Number(id), m, n, p, Number(a), c);
            break;
        }
        case "5": {
            const id = await ask("ID: ");
            deleteStudent(Number(id));
            break;
        }
        case "0":
            return showMainMenu(user);
        default:
            console.log("Choix invalide");
    }

    return showStudentMenu(user);
}


// MENU ENSEIGNANTS

async function showTeacherMenu(user) {
    console.log(`
TEACHER
1 - Ajouter
2 - Lister
3 - Voir par ID
4 - Modifier
5 - Supprimer
0 - Retour
`);

    const choice = await ask("Choix : ");
    return await handleTeacherMenu(choice, user);
}

async function handleTeacherMenu(choice, user) {
    switch (choice.trim()) {
        case "1": {
            const n = await ask("Nom: ");
            const m = await ask("Matière: ");
            addTeacher(n, m);
            break;
        }
        case "2":
            listTeachers();
            break;
        case "3": {
            const id = await ask("ID: ");
            getTeacherById(Number(id));
            break;
        }
        case "4": {
            const id = await ask("ID: ");
            const n = await ask("Nom: ");
            const m = await ask("Matière: ");
            updateTeacher(Number(id), n, m);
            break;
        }
        case "5": {
            const id = await ask("ID: ");
            deleteTeacher(Number(id));
            break;
        }
        case "0":
            return showMainMenu(user);
        default:
            console.log("Choix invalide");
    }

    return showTeacherMenu(user);
}


// MENU MATIÈRES

async function showSubjectMenu(user) {
    console.log(`
MATIÈRES
1 - Ajouter
2 - Lister
3 - Voir par ID
4 - Modifier
5 - Supprimer
0 - Retour
`);

    const choice = await ask("Choix : ");
    await handleSubjectMenu(choice, user);
}

async function handleSubjectMenu(choice, user) {
    switch (choice.trim()) {
        case "1": {
            const nom = await ask("Nom matière: ");
            const teacherId = await ask("ID enseignant: ");
            addSubject(nom, Number(teacherId));
            break;
        }
        case "2":
            listSubjects();
            break;
        case "3": {
            const id = await ask("ID: ");
            getSubjectById(Number(id));
            break;
        }
        case "4": {
            const id = await ask("ID: ");
            const nom = await ask("Nom: ");
            const teacherId = await ask("ID enseignant: ");
            updateSubject(Number(id), nom, Number(teacherId));
            break;
        }
        case "5": {
            const id = await ask("ID: ");
            deleteSubject(Number(id));
            break;
        }
        case "0":
            return showMainMenu(user);
        default:
            console.log("Choix invalide");
    }

    return showSubjectMenu(user);
}


// MENU NOTES

async function showGradeMenu(user) {
    console.log(`
NOTES
1 - Ajouter
2 - Lister
3 - Voir par ID
4 - Modifier
5 - Supprimer
0 - Retour
`);

    const choice = await ask("Choix : ");
    await handleGradeMenu(choice, user);
}

async function handleGradeMenu(choice, user) {
    switch (choice.trim()) {
        case "1": {
            const studentId = await ask("ID étudiant: ");
            const subjectId = await ask("ID matière: ");
            const note = await ask("Note: ");
            addGrade(Number(studentId), Number(subjectId), Number(note));
            break;
        }
        case "2":
            listGrades();
            break;
        case "3": {
            const id = await ask("ID note: ");
            getGradeById(Number(id));
            break;
        }
        case "4": {
            const id = await ask("ID: ");
            const studentId = await ask("ID étudiant: ");
            const subjectId = await ask("ID matière: ");
            const note = await ask("Note: ");
            updateGrade(Number(id), Number(studentId), Number(subjectId), Number(note));
            break;
        }
        case "5": {
            const id = await ask("ID: ");
            deleteGrade(Number(id));
            break;
        }
        case "0":
            return showMainMenu(user);
        default:
            console.log("Choix invalide");
    }

    return showGradeMenu(user);
}


// MENU ABSENCES

async function showAbsenceMenu(user) {
    console.log(`
ABSENCES
1 - Ajouter une absence
2 - Lister les absences
3 - Modifier une absence
4 - Supprimer une absence
0 - Retour
    `);

    const choice = await ask("Choix : ");
    await handleAbsenceMenu(choice, user);
}

async function handleAbsenceMenu(choice, user) {
    switch (choice.trim()) {
        case "1": {
            const studentId = await ask("ID étudiant: ");
            const date = await ask("Date (JJ/MM/AAAA): ");
            const reason = await ask("Motif: ");
            console.log(`\nDemande d'ajout enregistrée pour l'étudiant ID ${studentId}`);
            break;
        }
        case "2":
            console.log("\nAffichage de la liste des absences...");
            break;
        case "3": {
            const id = await ask("ID absence à modifier: ");
            const studentId = await ask("Nouvel ID étudiant: ");
            const date = await ask("Nouvelle Date: ");
            const reason = await ask("Nouveau Motif: ");
            console.log(`\nModification de l'absence ID ${id} demandée`);
            break;
        }
        case "4": {
            const id = await ask("ID absence à supprimer: ");
            console.log(`\nSuppression de l'absence ID ${id} demandée`);
            break;
        }
        case "0":
            return showMainMenu(user);
        default:
            console.log("Choix invalide");
    }

    return showAbsenceMenu(user);
}


// MENU STATISTIQUES

async function showStatsMenu(user) {
    console.log(`
STATISTIQUES
1 - Moyenne générale
2 - Meilleur élève
3 - Total absences
0 - Retour
`);

    const choice = await ask("Choix : ");
    await handleStatsMenu(choice, user);
}

async function handleStatsMenu(choice, user) {
    switch (choice.trim()) {
        case "1":
            console.log(getGeneralAverage());
            break;
        case "2":
            console.log(getBestStudent());
            break;
        case "3":
            console.log(countAbsences());
            break;
        case "0":
            return showMainMenu(user);
        default:
            console.log("Choix invalide");
    }

    return showStatsMenu(user);
}


// ROUTEUR PRINCIPAL

async function handleMainMenu(choice, user) {
    const role = user.role;

    switch (choice.trim()) {
        case "1":
            return await showStudentMenu(user);
        case "2":
    if (role !== "admin") {
        console.log("Accès refusé");
        return showMainMenu(user);
    }
    return await showAdminMenu(user);
        case "3":
            if (!["admin", "teacher"].includes(role)) {
                console.log("Accès refusé");
                return showMainMenu(user);
            }
            return await showSubjectMenu(user);
        case "4":
            if (!["admin", "teacher"].includes(role)) {
                console.log("Accès refusé");
                return showMainMenu(user);
            }
            return await showGradeMenu(user);
        case "5":
            if (!["admin", "teacher"].includes(role)) {
                console.log("Accès refusé");
                return showMainMenu(user);
            }
            return await showAbsenceMenu(user);
        case "6":
            if (role !== "admin") {
                console.log("Accès refusé");
                return showMainMenu(user);
            }
            return await showStatsMenu(user);
        case "0":
            console.log("Déconnexion...");
            return process.exit();
        default:
            console.log("Choix invalide");
            return showMainMenu(user);
    }
}

