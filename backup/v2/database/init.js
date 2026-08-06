const db = require("./database");

db.serialize(function () {

    db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, telegram_id TEXT UNIQUE, username TEXT, first_name TEXT, join_date DATETIME DEFAULT CURRENT_TIMESTAMP, status TEXT DEFAULT 'active')"
    );


    db.run(
        "CREATE TABLE IF NOT EXISTS buttons (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_id INTEGER DEFAULT 0, title TEXT NOT NULL, mode TEXT DEFAULT 'none', position INTEGER DEFAULT 0, visible INTEGER DEFAULT 1, locked INTEGER DEFAULT 0, command TEXT, link TEXT,content_order TEXT DEFAULT 'new' , description TEXT , created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"                                                           
        
    );


    db.run(
        "CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, button_id INTEGER, file_id TEXT, file_type TEXT, caption TEXT, position INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );


    db.run(
        "CREATE TABLE IF NOT EXISTS access_links (id INTEGER PRIMARY KEY AUTOINCREMENT, telegram_id TEXT, file_id TEXT, token TEXT UNIQUE, used INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );


    db.run(
        "CREATE TABLE IF NOT EXISTS blocked_users (id INTEGER PRIMARY KEY AUTOINCREMENT, telegram_id TEXT UNIQUE, reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    );


    db.run(
        "CREATE TABLE IF NOT EXISTS quick_answers (id INTEGER PRIMARY KEY AUTOINCREMENT, keyword TEXT, answer TEXT, status INTEGER DEFAULT 1)"
    );


    db.run(
        "CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id TEXT UNIQUE, title TEXT, type TEXT, status TEXT DEFAULT 'active')"
    );


    db.run(
        "CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, telegram_id TEXT UNIQUE, role TEXT DEFAULT 'admin')"
    );

});


console.log("ساخت جدول‌ها با موفقیت انجام شد.");