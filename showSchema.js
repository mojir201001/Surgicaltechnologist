const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/bot.db");

db.all(
  "SELECT name, sql FROM sqlite_master WHERE type='table' ORDER BY name",
  (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    rows.forEach((row) => {

        console.log(`\n---  ${row.name} ---\n${row.sql}`);
    });

    db.close();
  }
);