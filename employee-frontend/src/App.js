import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Dashboard token={token} handleLogout={handleLogout} />
      )}
    </>
  );
}

export default App;