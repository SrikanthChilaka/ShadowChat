import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './Login.css';

const Login = ({ changePage }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === '') {
      setError('Please enter a username');
    } else if (username.toLowerCase() === 'dog') {
      setError('Username "dog" is not allowed');
    } else {
      login(username)
        .then(() => {
          changePage('/client-id');
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"/>
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
