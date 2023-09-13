'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./datainterface/riddle-dao'); // module for accessing the DB
const answerDao = require('./datainterface/answer-dao')
const userDao = require('./datainterface/user-dao'); // module for accessing the users in the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const cors = require('cors');
const dayjs = require('dayjs');

/*** Set up Passport ***/ //->operazioni standard
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session); Mette dentro il coockie l'ID; anche qua standard
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.userid);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((userid, done) => {
  userDao.getUserById(userid)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});


// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions)); // NB: solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti

const isLoggedIn = (req, res, next) => { //funzione che permette l'autenticazione delle varie funzioni; NB non necessariamente tutte le API vanno autenticate
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session; Funzioni standard da usare per autenticazione
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** APIs ***/

// GET /api/riddlesAnon
app.get('/api/riddlesAnon', (req, res) => {
  dao.listRiddlesAnon()
    .then(riddles => res.json(riddles))
    .catch(() => res.status(500).end());
});

// GET /api/riddles
app.get('/api/riddles', isLoggedIn, (req, res) => {
  dao.listRiddles(req.user.userid)
    .then(riddles => res.json(riddles))
    .catch(() => res.status(500).end());
});

// GET /api/answers
app.get('/api/answers', isLoggedIn, (req, res) => {
  answerDao.listAnswers(req.user.userid)
    .then(answers => res.json(answers))
    .catch(() => res.status(500).end());
});

// POST /api/riddles
app.post('/api/riddles', isLoggedIn, [
  check('question').notEmpty(),
  check('difficulty').isIn(['easy', 'medium', 'hard']),
  check('duration').isInt({ min: 30000, max: 600000 }),
  check('correctAnswer').notEmpty(),
  check('suggestion1').notEmpty(),
  check('suggestion2').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const riddle = {
    question: req.body.question,
    difficulty: req.body.difficulty,
    duration: req.body.duration,
    correctAnswer: req.body.correctAnswer,
    suggestion1: req.body.suggestion1,
    suggestion2: req.body.suggestion2,
  };
  try {
    await dao.createRiddle(riddle, req.user.userid);
    res.status(201).end();
  } catch (err) {
    res.status(503).json(err);
  }
});

// PUT UPDATE RIDDLE STATE /api/riddles/:riddleid/checkState AND CHECK
app.put('/api/riddles/:riddleid/checkState', [
  check('riddleid').isInt()
], async (req, res) => {
  try {
    const riddle = await dao.getRiddleByRiddleid(req.body.riddleid);
      if (riddle.openingDate !== null) {
        const now = dayjs();
        if (now.diff(riddle.openingDate, 'millisecond') > riddle.duration) {
          riddle.state = 0;
          await dao.updateState(riddle)
            .then()
            .catch(err => handleError(err));
        }
      }
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the update of riddle ${req.params.riddleid}.` });
  }
});

//POST /api/answers with check
app.post('/api/answers', isLoggedIn, [
  check('answer').notEmpty(),
  check('riddleid').isInt(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const answer = {
    answer: req.body.answer,
    riddleid: req.body.riddleid,
  };
  const riddle = await dao.getRiddleByRiddleid(answer.riddleid);
  if (riddle.error) {
    res.status(404).json(riddle);
  }
  else {
    try {
      await answerDao.createAnswer(answer, req.user.userid);
      
      if (riddle.openingDate === null) {
        riddle.openingDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
        await dao.updateOpeningDateRiddle(riddle);
      }
      if (riddle.correctAnswer === answer.answer) {
        riddle.state = 0; //chiudo il riddle
        await dao.updateState(riddle);

        riddle.winner = req.user.name;
        await dao.updateWinner(riddle);

        let userPoints = req.user.points;
        if (riddle.difficulty === "easy") {
          userPoints = userPoints + 1;
        }
        else if (riddle.difficulty === "medium") {
          userPoints = userPoints + 2;
        }
        else if (riddle.difficulty === "hard") {
          userPoints = userPoints + 3;
        }
        const user =
        {
          userid: req.user.userid,
          point: userPoints
        }
        await userDao.updatePoint(user);
      }
      res.status(201).end();
    }
    catch (err) {
      console.log(err);
      res.status(503).json(err);
    }
  }
});


/*** Users APIs ***/

// GET /api/users/ranking
app.get('/api/users/ranking', (req, res) => {
  userDao.listUserRanking()
    .then(ranking => res.json(ranking))
    .catch(() => res.status(500).end());
});

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) { //Funzione che mi restituisce l'user in caso di login corretto
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});