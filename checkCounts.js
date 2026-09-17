const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/bot.db");

db.all(
  "SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence' ORDER BY name",
  function (err, tables) {
    if (err) {
      console.error(err);
      return;
    }

    let remaining = tables.length;

    tables.forEach(function (table) {
      db.get(
        "SELECT COUNT(*) AS count FROM " + table.name,
        function (err, row) {
          if (err) {
            console.error(table.name, err);
          } else {
            console.log(table.name + ": " + row.count);
          }

          remaining--;

          if (remaining === 0) {
            db.close();
          }
        }
      );
    });
  }
);