/**
 * All the API calls
 */
const dayjs = require("dayjs");
const URL = 'http://localhost:3001/api';


async function getAllRiddles() {
  // call: GET /api/riddles
  const response = await fetch(URL + '/riddles', { credentials: 'include' });
  const riddlesJson = await response.json();
  if (response.ok) {
    return riddlesJson.map((r) => ({ riddleid: r.riddleid, question: r.question, difficulty: r.difficulty, duration: r.duration, correctAnswer: r.correctAnswer, openingDate: r.openingDate === null ? null : dayjs(r.openingDate).format("YYYY-MM-DD HH:mm:ss"), suggestion1: r.suggestion1, suggestion2: r.suggestion2, state: r.state === 0 ? "close" : "open", userid: r.userid, winner: r.winner}))
  } else {
    throw riddlesJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getAllRiddlesAnon() {
  // call: GET /api/riddlesAnon
  const response = await fetch(URL + '/riddlesAnon', { credentials: 'include' });
  const riddlesJson = await response.json();
  if (response.ok) {
    return riddlesJson.map((r) => ({ riddleid: r.riddleid, question: r.question, difficulty: r.difficulty, state: r.state === 0 ? "close" : "open"}))
  } else {
    throw riddlesJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

async function getAllAnswers() {
  // call: GET /api/answers
  const response = await fetch(URL + '/answers', { credentials: 'include' });
  const riddlesJson = await response.json();
  if (response.ok) {
    return riddlesJson.map((r) => ({ answer: r.answer, riddleid: r.riddleid, userid: r.userid }))
  } else {
    throw riddlesJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

function addRiddle(riddle) {
  // call: POST /api/riddles
  return new Promise((resolve, reject) => {
    fetch(URL + '/riddles', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: riddle.question, difficulty: riddle.difficulty,
        duration: riddle.duration*1000, correctAnswer: riddle.correctAnswer,
        suggestion1: riddle.suggestion1,
        suggestion2: riddle.suggestion2
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function checkState(riddle) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/riddles/' + riddle.riddleid + '/checkState', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        riddleid: riddle.riddleid
      }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function addAnswer(answer) {
  // call: POST /api/answers
  return new Promise((resolve, reject) => {
    fetch(URL + '/answers', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: answer.answer, riddleid: answer.riddleid
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

/* user/logIn/logOut API */

async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', { //sessions è la continuazione dell'url per il login
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials), //faccio la richiesta al server
  });
  if (response.ok) {
    const user = await response.json();
    return user; //se è andato tutto bene ritorno l'user
  } else {
    const errDetail = await response.json();
    throw errDetail.message; //se ho problemi ritorno messaggio di errore
  }
}

async function logOut() { //API di logout
  await fetch(URL + '/sessions/current', { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
  const response = await fetch(URL + '/sessions/current', { credentials: 'include' });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

async function getUserRanking() {
  // call: GET /api/riddles
  const response = await fetch(URL + '/users/ranking');
  const userRankingJson = await response.json();
  if (response.ok) {
    let i=0;
    return userRankingJson.map((r) => {
      i++;
      return { id: i, name: r.name, points: r.points, position: r.position}
    });
  } else {
    throw userRankingJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

const API = { getAllRiddles, getAllRiddlesAnon, checkState, getAllAnswers, addRiddle, addAnswer, getUserRanking, logIn, logOut, getUserInfo };
export default API;