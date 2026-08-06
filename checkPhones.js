const db = require("./database/database");


db.all(
"SELECT name FROM sqlite_master WHERE type='table'",
[],
(err,data)=>{

console.log(data);

});