-- TABLE: access_links
CREATE TABLE access_links (id INTEGER PRIMARY KEY AUTOINCREMENT, telegram_id TEXT, file_id TEXT, token TEXT UNIQUE, used INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);

-- TABLE: admins
CREATE TABLE admins (id INTEGER PRIMARY KEY AUTOINCREMENT, telegram_id TEXT UNIQUE, role TEXT DEFAULT 'admin');

-- TABLE: blocked_users
CREATE TABLE blocked_users (id INTEGER PRIMARY KEY AUTOINCREMENT, telegram_id TEXT UNIQUE, reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);

-- TABLE: buttons
CREATE TABLE buttons (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_id INTEGER DEFAULT 0, title TEXT NOT NULL, mode TEXT DEFAULT 'folder', position INTEGER DEFAULT 0, visible INTEGER DEFAULT 1, locked INTEGER DEFAULT 0, command TEXT, link TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, content_order TEXT DEFAULT 'random', description TEXT, deleted INTEGER DEFAULT 0, deleted_at DATETIME, deleted_by TEXT, original_parent_id INTEGER DEFAULT 0, updated_at DATETIME, updated_by TEXT, deleted_root_id INTEGER DEFAULT 0, types TEXT DEFAULT '');

-- TABLE: chats
CREATE TABLE chats (id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id TEXT UNIQUE, title TEXT, type TEXT, status TEXT DEFAULT 'active');

-- TABLE: files
CREATE TABLE files (id INTEGER PRIMARY KEY AUTOINCREMENT, button_id INTEGER, file_id TEXT, file_type TEXT, caption TEXT, position INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, message_id INTEGER, chat_id TEXT, access_type TEXT DEFAULT 'public', price INTEGER DEFAULT 0, deleted INTEGER DEFAULT 0, deleted_at DATETIME, deleted_by TEXT, updated_by TEXT, updated_at DATETIME, deleted_root_id INTEGER DEFAULT 0);

-- TABLE: quick_answers
CREATE TABLE quick_answers (id INTEGER PRIMARY KEY AUTOINCREMENT, keyword TEXT, answer TEXT, status INTEGER DEFAULT 1);

-- TABLE: settings
CREATE TABLE settings (
    
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    key TEXT UNIQUE,
    
    value TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    
    );

-- TABLE: user_phones
CREATE TABLE user_phones (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,phone TEXT,created_at DATETIME DEFAULT CURRENT_TIMESTAMP);

-- TABLE: users
CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, telegram_id TEXT UNIQUE, username TEXT, first_name TEXT, phone TEXT, last_name TEXT);

