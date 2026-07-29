import db from "./db/database.js";
//cette fonction est pour ajouter un étudiant
import { addStudent } from "./services/studentService.js";
//cette fonction est pour supprimer un étudiant
import{deleteStudent} from "./services/studentService.js";
//cette fonction est pour afficher un étudiant par son id
import { getStudentById } from "./services/studentService.js";
//cette fonction est pour lister tous les étudiants
import{listStudents} from "./services/studentService.js";
//cette fonction est pour mettre à jour un étudiant par son id
import{updateStudent} from "./services/studentService.js";

//cette fonction est pour ajouter un enseignant
import {addTeacher} from "./services/teacherService.js";
//cette fonction est pour rechercher un enseignant 
import {getTeacherById} from "./services/teacherService.js";
//cette fonction est pour supprimer un enseignant
import {deleteTeacher} from "./services/teacherService.js";
//cette fonction est pour modifier un enseignant
import {updateTeacher} from "./services/teacherService.js";
//cette fonction est pour lister tous les enseignants
import {listTeachers} from "./services/teacherService.js";

//cette fonctionnalité est pour les users

//cette fonction est pour ajouter un utilisateur
import {addUser} from "./services/userService.js";
//cette fonction est pour supprimer un utilisateur
import {deleteUser} from "./services/userService.js";
//cette fonction est pour modifier un utilisateur
import {updateUser} from "./services/userService.js";
//cette fonction est pour lister tous les utilisateurs
import {listUsers} from "./services/userService.js";
//cette fonction est pour rechercher un utilisateur par son id
import {getUserById} from "./services/userService.js";

//cette fonctionnalité est pour les subject

import { addSubject } from "./services/subjectService.js";
import { listSubjects } from "./services/subjectService.js";
import { getSubjectById } from "./services/subjectService.js";
import { updateSubject } from "./services/subjectService.js";
import { deleteSubject } from "./services/subjectService.js";

//cette fonction est pour les notes

import { addGrade } from "./services/gradeService.js";
import {listGrades}  from "./services/gradeService.js";
import {deleteGrade} from "./services/gradeService.js";
import {updateGrade} from "./services/gradeService.js";
import { getGradeById } from "./services/gradeService.js";

//cette fonction est pour les stats

import { getGeneralAverage } from "./services/statsService.js";
import { getBestStudent } from "./services/statsService.js";
import { countAbsences } from "./services/statsService.js";


// Fonction auth
import { ask } from "./utils/ask.js";
import { login } from "./auth/authService.js";
import { showMainMenu } from "./menu/mainMenu.js";
import { setUser } from "./utils/session.js";

async function startApp() {
    console.clear();
    console.log(`

        ____________ BIENVENUE ____________

                       *A*

              ___SCHOOL-MANAGEMENT___




                ** Se connecter ** 
    `);

console.log("\n Tapez 0 pour reprendre la saisie.\n");

const nom = await ask("Nom : ");
if (nom === "0") return startApp();

const prenom = await ask("Prénom : ");
if (prenom === "0") return startApp();

const password = await ask("Mot de passe : ");
if (password === "0") return startApp();

    const user = login(nom, prenom, password);

    if (!user) {
        console.log(" Identifiants incorrects");
        return startApp();
    }

    setUser(user);

    console.log(`\n Bienvenue ${user.nom} ${user.prenom}  (${user.role})\n`);

    showMainMenu(user);
}



startApp();






