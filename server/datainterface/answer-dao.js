'use strict';

/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('indovinelli.db', (err) => {
    if (err) throw err;
});

exports.listAnswers = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT a.answer, a.riddleid, a.userid FROM answer as a, riddle as r WHERE r.riddleid = a.riddleid and (r.userid = ? or r.state = 0 or a.userid = ?)';
    db.all(sql, [userId, userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const answer = rows.map((r) => ({
          answer: r.answer, riddleid: r.riddleid, userid: r.userid
      }));
      resolve(answer);
    });
  });
};

// add a new riddle
exports.createAnswer = (answer, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO answer(answer, riddleid, userid) VALUES(?, ?, ?)';
    db.run(sql, [answer.answer, answer.riddleid, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};