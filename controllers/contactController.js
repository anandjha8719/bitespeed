const db = require("../db/database");

function createContact(email, phoneNumber, linkPrecedence) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO Contact (phoneNumber, email, linkPrecedence, createdAt, updatedAt)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `);

    stmt.run(phoneNumber, email, linkPrecedence, function () {
      const lastInsertedId = this.lastID;
      console.log("Last inserted ID:", lastInsertedId);
      resolve(lastInsertedId);
    });

    stmt.finalize();
  });
}

function findContactByEmailOrPhone(email, phoneNumber) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM Contact WHERE email = ?`,
      [email, phoneNumber],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });
}

function findSecondaryContacts(primaryContactId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM Contact WHERE linkedId = ?`,
      [primaryContactId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

module.exports = {
  createContact,
  findContactByEmailOrPhone,
  findSecondaryContacts,
};
