'use strict';
const dayjs = require('dayjs');

/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('indovinelli.db', (err) => {
  if (err) throw err;
});

// get all riddles (not loggedIn)
exports.listRiddlesAnon = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT riddleid, question, difficulty, state FROM riddle';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const riddles = rows.map((r) => ({
        riddleid: r.riddleid, question: r.question, difficulty: r.difficulty, state: r.state
      }));
      resolve(riddles);
    });
  });
};

// get all riddles
exports.listRiddles = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM riddle';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const riddles = rows.map((r) => {
          let riddle;
          if (r.userid !== userId && r.state === 1) {
            riddle = { riddleid: r.riddleid, question: r.question, difficulty: r.difficulty, duration: r.duration, correctAnswer: null, openingDate: new dayjs(r.openingDate), suggestion1: r.suggestion1, suggestion2: r.suggestion2, state: r.state, userid: r.userid, winner: r.winner };
          }
          else {
            riddle = { riddleid: r.riddleid, question: r.question, difficulty: r.difficulty, duration: r.duration, correctAnswer: r.correctAnswer, openingDate: new dayjs(r.openingDate), suggestion1: r.suggestion1, suggestion2: r.suggestion2, state: r.state, userid: r.userid, winner: r.winner };
          }
          return riddle;
      });
      
      resolve(riddles);
    });
  });
};

// get the riddle identified by {riddleid}
exports.getRiddleByRiddleid = (riddleid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM riddle WHERE riddleid = ?';
    db.get(sql, [riddleid], (err, r) => {
      if (err) {
        reject(err);
        return;
      }
      if (r === undefined) {
        resolve({ error: 'Riddle not found.' });
      } else {
        const riddle = { riddleid: r.riddleid, question: r.question, difficulty: r.difficulty, duration: r.duration, correctAnswer: r.correctAnswer, openingDate: r.openingDate === null ? null : new dayjs(r.openingDate), suggestion1: r.suggestion1, suggestion2: r.suggestion2, state: r.state, userid: r.userid, winner: r.winner };
        resolve(riddle);
      }
    });
  });
};

// add a new riddle
exports.createRiddle = (riddle, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO riddle(question, difficulty, duration, correctAnswer, suggestion1, suggestion2, userid) VALUES(?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [riddle.question, riddle.difficulty, riddle.duration, riddle.correctAnswer, riddle.suggestion1, riddle.suggestion2, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// update the openingDate of riddle
exports.updateOpeningDateRiddle = (riddle) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE riddle SET openingDate = ? WHERE riddleid = ?';
    db.run(sql, [riddle.openingDate, riddle.riddleid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

// update the state of riddle
exports.updateState = (riddle) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE riddle SET state = ? WHERE riddleid = ?';
    db.run(sql, [riddle.state, riddle.riddleid], function (err) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve();
    });
  });
};

// update the winner of riddle
exports.updateWinner = (riddle) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE riddle SET winner = ? WHERE riddleid = ?';
    db.run(sql, [riddle.winner, riddle.riddleid], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};