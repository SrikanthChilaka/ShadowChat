import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './ClientIdPage.css';

const ClientIdPage = ({ clientId, changePage }) => {
  const { login, state } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username.trim() === '') {
      setError('Please enter a username');
    } else if (username.toLowerCase() === 'dog') {
      setError('Username "dog" is not allowed');
    } else {
      login(username)
        .then(() => {
          changePage('/chat');
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  return (
    <div className="client-id-page">
      <h2>Your Client ID is: {clientId}</h2>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"/>
      </label>
      {error && <div className="error">{error}</div>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default ClientIdPage;
