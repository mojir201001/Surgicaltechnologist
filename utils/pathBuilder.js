const db = require("../database/database");

function getButtonPath(buttonId, callback){

    db.all(

`WITH RECURSIVE path(id,parent_id,title) AS (

SELECT id,parent_id,title
FROM buttons
WHERE id=?

UNION ALL

SELECT b.id,b.parent_id,b.title
FROM buttons b
JOIN path p
ON b.id=p.parent_id

)

SELECT title
FROM path`

,

[buttonId],

(err,rows)=>{

    if(err || !rows){

        callback("نامشخص");

        return;

    }

    const path = rows
    .reverse()
    .map(item=>item.title)
    .join(" ➜ ");

    callback("🏠 صفحه اصلی ➜ " + path);

});

}

module.exports = {
    getButtonPath
};