const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database", "bot.db");
const outDir = path.join(__dirname, "cloudflare-worker", "migrations");

fs.mkdirSync(outDir, { recursive: true });

const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READONLY,
    (err) => {
        if (err) {
            console.error("❌ خطا در باز کردن دیتابیس:", err.message);
            process.exit(1);
        }

        console.log("✅ دیتابیس فقط برای خواندن باز شد.");
    }
);

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function escapeValue(value) {
    if (value === null || value === undefined) {
        return "NULL";
    }

    if (typeof value === "number") {
        return String(value);
    }

    if (typeof value === "boolean") {
        return value ? "1" : "0";
    }

    return "'" + String(value).replace(/'/g, "''") + "'";
}

async function main() {
    console.log("🔍 در حال خواندن ساختار دیتابیس...");

    const tables = await all(
        `SELECT name, sql
        FROM sqlite_master
        WHERE type='table'
        AND name != 'sqlite_sequence'
        ORDER BY name`
    );

    let schema = "";
    let data = "";

    for (const table of tables) {
        console.log("📦 جدول:", table.name);

        schema += `-- TABLE: ${table.name}\n`;
        schema += table.sql + ";\n\n";

        const rows = await all(`SELECT * FROM "${table.name}"`);

        if (rows.length === 0) {
            data += `-- ${table.name}: empty\n\n`;
            continue;
        }

        const columns = Object.keys(rows[0]);

        for (const row of rows) {
            const values = columns.map(
                column => escapeValue(row[column])
            );

          
            data += `INSERT INTO "${table.name}" ("${columns.join('", "')}") VALUES (${values.join(", ")});\n`;
        }

        data += "\n";
    }

    fs.writeFileSync(
        path.join(outDir, "schema.sql"),
        schema,
        "utf8"
    );

    fs.writeFileSync(
        path.join(outDir, "data.sql"),
        data,
        "utf8"
    );

    console.log("");
    console.log("✅ مهاجرت ساخته شد.");
    console.log("📄 cloudflare-worker/migrations/schema.sql");
    console.log("📄 cloudflare-worker/migrations/data.sql");
    console.log("");
    console.log("⚠️ دیتابیس اصلی تغییر نکرده است.");

    db.close();
}

main().catch(err => {
    console.error("❌ خطا:", err.message);
    db.close();
    process.exit(1);
});