import './App.css';

import HomePage from './components/homepage/Home';
import RegisterPage from './components/register/Register';
import LoginPage from './components/login/Login';

import { useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import TractionLeague from './components/tractionLeague/tractionLeague';
import ClassPage from './components/classPage/classPage';

function App() {
  const [user, setLoginUser] = useState({});

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={user && user._id ? <HomePage user={ user } /> : <LoginPage setLoginUser={ setLoginUser } />} />
          <Route exact path="/tractionleague" element={user && user._id ? <TractionLeague user={ user } /> : <LoginPage setLoginUser={ setLoginUser } />} />
          <Route exact path="/class" element={user && user._id ? <ClassPage user={ user } /> : <LoginPage setLoginUser={ setLoginUser } />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/login" element={<LoginPage setLoginUser={ setLoginUser } />} />
        </Routes>
    </div>
  );
}

export default App;
