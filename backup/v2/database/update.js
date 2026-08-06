/*const db = require("./database");


db.run(
`ALTER TABLE buttons
ADD COLUMN description TEXT`,
function(err){

    if(err){

        console.log("خطا یا ستون قبلا وجود دارد:", err.message);

    }
    else{

        console.log("ستون description اضافه شد.");

    }

});





db.run(

`ALTER TABLE files
ADD COLUMN access_type TEXT DEFAULT 'public'`
,
function(err){

if(err)
console.log(err.message);

else
console.log("access_type اضافه شد");

});



db.run(

`ALTER TABLE files
ADD COLUMN price INTEGER DEFAULT 0`
,
function(err){

if(err)
console.log(err.message);

else
console.log("price اضافه شد");

});*/

