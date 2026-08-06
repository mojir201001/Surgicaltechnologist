const db = require("./database");


const columns = [

    {
        table: "buttons",
        column: "deleted_root_id",
        type: "INTEGER DEFAULT 0"
    },
    
    {
        table: "files",
        column: "deleted_root_id",
        type: "INTEGER DEFAULT 0"
    },

    {
        table: "buttons",
        column: "updated_at",
        type: "DATETIME"
    },
    
    {
        table: "buttons",
        column: "updated_by",
        type: "TEXT"
    },
    
    {
        table: "files",
        column: "updated_at",
        type: "DATETIME"
    },
    
    {
        table: "files",
        column: "updated_by",
        type: "TEXT"
    },


    {
        table: "buttons",
        column: "deleted",
        type: "INTEGER DEFAULT 0"
    },

    {
        table: "buttons",
        column: "deleted_at",
        type: "DATETIME"
    },

    {
        table: "buttons",
        column: "deleted_by",
        type: "TEXT"
    },

    {
        table: "buttons",
        column: "original_parent_id",
        type: "INTEGER DEFAULT 0"
    },


    {
        table: "buttons",
        column: "types",
        type: "TEXT DEFAULT ''"
    },
    

    {
        table: "files",
        column: "deleted",
        type: "INTEGER DEFAULT 0"
    },

    {
        table: "files",
        column: "deleted_at",
        type: "DATETIME"
    },

    {
        table: "files",
        column: "deleted_by",
        type: "TEXT"
    }

];



columns.forEach(item => {



    


    db.run(
        `ALTER TABLE ${item.table}
        ADD COLUMN ${item.column} ${item.type}`,

        function(err){


            if(err){

                console.log(
                    `⚠️ ${item.column}: قبلاً وجود دارد یا خطا`,
                    err.message
                );

            }
            else{

                console.log(
                    `✅ ستون ${item.column} اضافه شد`
                );

            }


        }

    );


});







db.run(


    `CREATE TABLE IF NOT EXISTS settings (
    
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    key TEXT UNIQUE,
    
    value TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    
    )`
    ,
    
    function(err){
    
        if(err){
    
            console.log(
                "❌ خطا در ساخت جدول settings:",
                err.message
            );
    
        }
        else{
    
            console.log(
                "✅ جدول settings آماده شد."
            );
    
        }
    
    }
    
    );





    setTimeout(()=>{

        db.close();
    
    },1000);







    