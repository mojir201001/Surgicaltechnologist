const db = require("./database");


db.run(
`ALTER TABLE users ADD COLUMN phone TEXT`
);

db.run(
`ALTER TABLE users ADD COLUMN last_name TEXT`
);

console.log("updated");