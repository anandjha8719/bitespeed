const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Contact (
      id INTEGER PRIMARY KEY,
      phoneNumber TEXT,
      email TEXT,
      linkedId INTEGER,
      linkPrecedence TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      deletedAt TEXT
    )
  `);
});

module.exports = db;
