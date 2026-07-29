// controllers/subjectController.js


import {

    listSubjects,
    addSubject,
    updateSubject,
    deleteSubject

} from "../services/subjectService.js";





// ==========================
// Afficher les matières
// ==========================

export function getSubjects(req,res){


    try{


        const subjects = listSubjects();


        res.json(subjects);



    }catch(error){


        console.error(error);


        res.status(500).json({

            message:"Erreur serveur"

        });


    }


}







// ==========================
// Ajouter une matière
// ==========================

export function createSubject(req,res){


    try{


        const {

            nom

        } = req.body;



        if(!nom){


            return res.status(400).json({

                message:"Nom obligatoire"

            });


        }




        addSubject(
            nom
        );



        res.json({

            message:"Matière ajoutée avec succès"

        });



    }catch(error){


        console.error(error);


        res.status(500).json({

            message:"Erreur serveur"

        });


    }


}







// ==========================
// Modifier une matière
// ==========================

export function editSubject(req,res){


    try{


        const id =
        req.params.id;



        const {

            nom

        } = req.body;



        updateSubject(
            id,
            nom
        );



        res.json({

            message:"Matière modifiée avec succès"

        });



    }catch(error){


        console.error(error);


        res.status(500).json({

            message:"Erreur serveur"

        });


    }


}







// ==========================
// Supprimer une matière
// ==========================

export function removeSubject(req,res){


    try{


        const id =
        req.params.id;



        deleteSubject(id);



        res.json({

            message:"Matière supprimée avec succès"

        });



    }catch(error){


        console.error(error);


        res.status(500).json({

            message:"Erreur serveur"

        });


    }


}