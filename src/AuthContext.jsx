import React, { createContext, useReducer } from 'react';
import { login, logout, validateSession, getClientId } from './AuthService';

export const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  username: '',
  clientId: '',
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { isLoggedIn: true, username: action.payload.username, clientId: action.payload.clientId };
    case 'LOGOUT':
      return { isLoggedIn: false, username: '', clientId: '' };
    case 'UPDATE_MESSAGES':
      return { ...state, messages: action.payload.messages };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const handleLogin = (username) => {
    return login(username)
      .then((response) => {
        dispatch({ type: 'LOGIN', payload: response });
        return response;
      })
      .catch((error) => {
        console.error('Login failed:', error);
        throw error;
      });
  };

  const handleLogout = () => {
    return logout()
      .then(() => {
        dispatch({ type: 'LOGOUT' });
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        throw error;
      });
  };

  const handleValidateSession = (username, sessionToken) => {
    return validateSession(username, sessionToken);
  };

  const handleGetClientId = (username, sessionToken) => {
    return getClientId(username, sessionToken)
      .then((clientId) => {
        return clientId;
      })
      .catch((error) => {
        console.error('Failed to get client ID:', error);
        throw error;
      });
  };
  const handleUpdateMessages = (messages) => {
    dispatch({ type: 'UPDATE_MESSAGES', payload: { messages } });
  };

  return (
    <AuthContext.Provider
      value={{ state, dispatch, login: handleLogin, logout: handleLogout, validateSession: handleValidateSession, getClientId: handleGetClientId, updateMessages: handleUpdateMessages, }}
    >
      {children}
    </AuthContext.Provider>
  );
};