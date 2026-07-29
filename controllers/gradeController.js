import {
    listGrades,
    listGradesByStudent,
    addGrade,
    updateGrade,
    deleteGrade
} from "../services/gradeService.js";




// Liste des notes

export function getGrades(req,res){

    try{

        const grades = listGrades();

        res.json(grades);


    }catch(error){

        console.error(error);

        res.status(500).json({
            message:"Erreur serveur"
        });

    }

}





// Notes d'un élève précis

export function getStudentGrades(req,res){

    try{

        const grades = listGradesByStudent(req.params.id);

        res.json(grades);

    }catch(error){

        console.error(error);

        res.status(500).json({
            message:"Erreur serveur"
        });

    }

}



// Ajouter une note

export function createGrade(req,res){

    try{


        const {
            student_id,
            subject_id,
            note
        } = req.body;



        addGrade(
            student_id,
            subject_id,
            note
        );



        res.json({

            message:"Note ajoutée avec succès"

        });



    }catch(error){


        console.error(error);


        res.status(500).json({

            message:"Erreur serveur"

        });


    }

}






// Modifier

export function editGrade(req,res){

    try{


        const id = req.params.id;


        const {
            student_id,
            subject_id,
            note
        } = req.body;



        updateGrade(
            id,
            student_id,
            subject_id,
            note
        );



        res.json({

            message:"Note modifiée"

        });



    }catch(error){

        res.status(500).json({
            message:"Erreur serveur"
        });

    }

}







// Supprimer

export function removeGrade(req,res){


    try{


        const id = req.params.id;


        deleteGrade(id);



        res.json({

            message:"Note supprimée"

        });



    }catch(error){


        res.status(500).json({

            message:"Erreur serveur"

        });


    }


}