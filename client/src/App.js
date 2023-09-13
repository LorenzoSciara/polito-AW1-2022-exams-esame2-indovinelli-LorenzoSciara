import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginForm } from './components/LoginComponents';
import { HomePage } from "./components/homePage";
import { LoggedInPage } from "./components/loggedInPage";
import { NoMatch } from "./components/noMatch";
import { RiddleForm } from "./components/RiddleForm";
import dayjs from 'dayjs';
import API from './API';

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}

function App2() {
  const [riddles, setRiddles] = useState([]);
  const [dirtyRiddles, setDirtyRiddles] = useState(false);  //Update riddles list from database
  const [loadingRiddles, setLoadingRiddles] = useState(true); //wait for the riddles loading
  const [riddlesAnon, setRiddlesAnon] = useState([]);
  const [loadingRiddlesAnon, setLoadingRiddlesAnon] = useState(true); //wait for the riddles loading
  const [answers, setAnswers] = useState([]);
  const [dirtyAnswers, setDirtyAnswers] = useState(false);  //Update riddles list from database
  const [ranking, setRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(true); //wait for the ranking loading

  const [polling, setPolling] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);  // no user is logged in when app loads
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
    setInterval(() => setPolling(oldPolling => !oldPolling), 1000);//Attiva il timer per il polling appena si accede all'applicazione
  }, []);

  //IMPLEMENTAZIONE POLLING con stato
  useEffect(() => {
    API.getAllRiddlesAnon().then((riddles) => {
      setRiddlesAnon(riddles);
      setLoadingRiddlesAnon(false);
      riddles.forEach(riddle => { if (riddle.state === "open") API.checkState(riddle); });
    });

    API.getUserRanking().then((ranking) => { setRanking(ranking); setLoadingRanking(false); })
      .catch(err => handleError(err));

    if (loggedIn) {//Polling per user loggato
      API.getAllRiddles().then((riddles) => {
        riddles = riddles.map(riddle => {
          if (riddle.state === "open") {
            if (riddle.openingDate !== null) {
              const now = dayjs();
              riddle.remainingTime = Math.round((riddle.duration - (now.diff(riddle.openingDate, 'millisecond'))) / 1000);
            }
            else {
              riddle.remainingTime = null;
            }
          }

          return riddle;
        });
        setRiddles(riddles);
        setLoadingRiddles(false);
      })
        .catch(err => handleError(err));
      API.getAllAnswers().then((answers) => { setAnswers(answers); })
        .catch(err => handleError(err));
    }
  }, [polling, loggedIn]);


  useEffect(() => {
    if (dirtyRiddles === true) {
      API.getAllRiddles().then((riddles) => {
        setRiddles(riddles);
        setDirtyRiddles(false);
      })
        .catch(err => handleError(err));
    }
  }, [dirtyRiddles])

  useEffect(() => {
    if (dirtyAnswers === true) {
      API.getAllAnswers().then((answers) => {
        setAnswers(answers);
        setDirtyAnswers(false);
      })
        .catch(err => handleError(err));
    }
  }, [dirtyAnswers])


  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/loggedInPage/riddles');
      })
      .catch(err => {
        setMessage(err);
      }
      )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setMessage('');
    navigate('/homePage/riddles');
  }

  function addRiddle(riddle) {
    API.addRiddle(riddle)
      .then(() => setDirtyRiddles(true))
      .catch(err => handleError(err));
  }

  function addAnswer(answer) {
    API.addAnswer(answer)
      .then(() => {
        setDirtyAnswers(true);
        setDirtyRiddles(true);
      })
      .catch(err => handleError(err));
  }

  function handleError(err) {
    console.log(err);
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage loggedIn={loggedIn} doLogOut={doLogOut}
          riddles={riddlesAnon} loadingRiddles={loadingRiddlesAnon} />}
        />
        <Route path='/homePage/:filter' element={<HomePage loggedIn={loggedIn} doLogOut={doLogOut}
          riddles={riddlesAnon} loadingRiddles={loadingRiddlesAnon}
          ranking={ranking} loadingRanking={loadingRanking} />}
        />
        <Route path='/login' element={loggedIn ? <Navigate to='/loggedInPage/riddles' /> : <LoginForm login={doLogIn} loggedIn={loggedIn} message={message} setMessage={setMessage} />} />
        <Route path='/loggedInPage/:filter' element={
          loggedIn ?
            <LoggedInPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} doLogOut={doLogOut} user={user} setUser={setUser}
              message={message} setMessage={setMessage}
              riddles={riddles} loadingRiddles={loadingRiddles}
              ranking={ranking} loadingRanking={loadingRanking}
              answers={answers} addAnswer={addAnswer}
            />
            : <Navigate to='/login' />
        } />
        <Route path='/addRiddle' element={
          loggedIn ?
            <RiddleForm addRiddle={addRiddle} />
            : <Navigate to='/login' />
        } />
        <Route path="*" element={
          <NoMatch />
        } />
      </Routes>
    </>
  );
}

export default App;
