const db = require("../database/database");



function getDeletedTree(buttonId, callback){


    let result = [];


    function loadChildren(parentId, path, done){


        db.all(


`SELECT *
FROM buttons
WHERE parent_id=?
AND deleted=1
ORDER BY position ASC`
,

[parentId],

(err,buttons)=>{


            if(err){
                done();
                return;
            }



            let count = buttons.length;


            if(count===0){
                done();
                return;
            }



            buttons.forEach(button=>{


                let item = {

                    id: button.id,
                    title: button.title,
                    mode: button.mode,
                    path: path + " / " + button.title,
                    files: [],
                    children: []

                };



                db.all(


`SELECT *
FROM files
WHERE button_id=?
AND deleted=1`
,

[button.id],

(err,files)=>{


                    if(!err && files){

                        item.files = files;

                    }



                    loadChildren(

                        button.id,

                        item.path,

                        ()=>{

                            result.push(item);

                            count--;


                            if(count===0){

                                done();

                            }


                        }

                    );


                });



            });



        });



    }



    db.get(


`SELECT *
FROM buttons
WHERE id=?`
,

[buttonId],

(err,root)=>{


        if(err || !root){

            callback([]);

            return;

        }



        let rootItem = {

            id: root.id,
            title: root.title,
            mode: root.mode,
            path: root.title,
            files: [],
            children: []

        };



        db.all(


`SELECT *
FROM files
WHERE button_id=?
AND deleted=1`
,

[root.id],

(err,files)=>{


            if(!err && files){

                rootItem.files = files;

            }



            loadChildren(

                root.id,
                root.title,
                ()=>{


                    rootItem.children = result;


                    callback(rootItem);


                }

            );


        });



    });



}



module.exports = getDeletedTree;