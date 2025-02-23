import { getAllSessions } from './AuthService';

function generateRandomUsername(length = 7) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let username = '';
  for (let i = 0; i < length; i++) {
    username += chars[Math.floor(Math.random() * chars.length)];
  }
  return username;
}

export const getMessages = (username, clientId) => {
  return fetch(`/api/messages/${username}/${clientId}`, {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => data.messages);
      } else if (response.status === 401) {
        return response.json().then((error) => {
          throw new Error('Session expired: ' + error.error);
        });
      } else {
        return response.json().then((error) => {
          throw new Error('Server error: ' + error.error);
        });
      }
    })
    .catch((error) => {
      if (error.message.startsWith('Session expired:')) {
        console.error('Session expired:', error);
      } else if (error.message.startsWith('Server error:')) {
        console.error('Server error:', error);
      } else {
        console.error('Failed to retrieve messages:', error);
      }
      throw error;
    });
};

export const getAllMessages = () => {
  return fetch('/api/messages', {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => data.messages);
      } else if (response.status === 401) {
        return response.json().then((error) => {
          throw new Error('Session expired: ' + error.error);
        });
      } else {
        return response.json().then((error) => {
          throw new Error('Server error: ' + error.error);
        });
      }
    })
    .catch((error) => {
      if (error.message.startsWith('Session expired:')) {
        console.error('Session expired:', error);
      } else if (error.message.startsWith('Server error:')) {
        console.error('Server error:', error);
      } else {
        console.error('Failed to retrieve messages:', error);
      }
      throw error;
    });
};

export const sendMessage = (username, clientId, message) => {
  return fetch(`/api/messages/${username}/${clientId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        return response.json().then((error) => {
          throw new Error('Session expired: ' + error.error);
        });
      } else {
        return response.json().then((error) => {
          throw new Error('Server error: ' + error.error);
        });
      }
    })
    .catch((error) => {
      if (error.message.startsWith('Session expired:')) {
        console.error('Session expired:', error);
      } else if (error.message.startsWith('Server error:')) {
        console.error('Server error:', error);
      } else {
        console.error('Failed to send message:', error);
      }
      throw error;
    });
};

export const generateAnonymousUsername = generateRandomUsername;