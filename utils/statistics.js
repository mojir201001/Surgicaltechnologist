const db = require("../database/database");


function getButtonStatistics(buttonId, callback){

    db.get(
        
        `SELECT 
        COUNT(*) AS files
        FROM files
        WHERE button_id=? 
        AND deleted=0`
        ,
        [buttonId],
        (err,files)=>{

            db.get(
                
                `SELECT 
                COUNT(*) AS subButtons
                FROM buttons
                WHERE parent_id=?
                AND deleted=0`
                ,
                [buttonId],
                (err,subs)=>{



                    db.get(
                        `WITH RECURSIVE tree(id) AS (
                        
                        SELECT id
                        FROM buttons
                        WHERE id=?
                        
                        UNION ALL
                        
                        SELECT b.id
                        FROM buttons b
                        JOIN tree t
                        ON b.parent_id=t.id
                        WHERE b.deleted=0
                        
                        )
                        
                        SELECT COUNT(*) AS totalSubs
                        FROM tree
                        WHERE id<>?`,
                        [buttonId,buttonId],
                        (err,totalSubs)=>{




                            db.get(

                                `SELECT COUNT(*) AS totalFiles
                                FROM files
                                WHERE deleted=0
                                AND button_id IN (
                                
                                WITH RECURSIVE tree(id) AS (
                                
                                SELECT id
                                FROM buttons
                                WHERE id=?
                                
                                UNION ALL
                                
                                SELECT b.id
                                FROM buttons b
                                JOIN tree t
                                ON b.parent_id=t.id
                                WHERE b.deleted=0
                                
                                )
                                
                                SELECT id FROM tree
                                
                                )`,
                                
                                [buttonId],
                                
                                (err,totalFiles)=>{


                    callback({

                        directFiles: files ? files.files : 0,
                        totalFiles: totalFiles ? totalFiles.totalFiles : 0,
                    
                        directSubButtons: subs ? subs.subButtons : 0,
                        totalSubButtons: totalSubs ? totalSubs.totalSubs : 0,
                    
                        directLinks: 0,
                        totalLinks: 0,
                    
                        inputs:{
                            topic:"",
                            count:0
                        }
                    
                    });

                });
                });


        
        });

    });

}


module.exports={
    getButtonStatistics
};