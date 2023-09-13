'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open the database
const db = new sqlite.Database('indovinelli.db', (err) => {
    if(err) throw err;
  });

//Funzioni utili per l'autenticazione
exports.getUserById = (userid) => { //Qua non ho autenticazione perchè se richiedo l'user by id significa che è già autenticato e l'informazione è sicura
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE userid = ?';
      db.get(sql, [userid], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
          const user = {userid: row.userid, username: row.email, name: row.name, points: row.points}
          resolve(user);
        }
    });
  });
};

//Funzioni utili per l'autenticazione
exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) { reject(err); }
        else if (row === undefined) { resolve(false); }
        else {
          const user = {userid: row.userid, username: row.email, name: row.name, points: row.points};
          
          const salt = row.salt;
          crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);

            const passwordHex = Buffer.from(row.hash, 'hex');

            if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
              resolve(false);
            else resolve(user); 
          });
        }
      });
    });
  };

  // update the openingDate of riddle
exports.updatePoint = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE user SET points = ? WHERE userid = ?';
    db.run(sql, [user.point, user.userid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

exports.listUserRanking = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM (SELECT name, points, DENSE_RANK() OVER(ORDER BY points DESC) AS ranking FROM user) WHERE ranking <= 3';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const ranking = rows.map((r) => ({
          name: r.name, points: r.points, position: r.ranking
      }));
      resolve(ranking);
    });
  });
}