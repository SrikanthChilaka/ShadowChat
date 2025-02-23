const { json } = require('express');
const uuid = require('uuid');
let sessions = new Map();
let messages = new Map();

function createUuidSessionTokenGenerator() {
  function generate() {
    return uuid.v4();
  }

  return { generate };
}

function createRandomClientIdGenerator() {
  function generate(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let clientId = '';
    for (let i = 0; i < length; i++) {
      clientId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return clientId;
  }

  return { generate };
}

function createSessionRepository(username) {
  if (!username || !username.match(/^[a-zA-Z0-9]+$/)) {
    throw new Error('Username is required', { statusCode: 400 });
  }

  if (username.toLowerCase() === 'dog') {
    throw new Error('Username "dog" is not allowed', { statusCode: 403 });
  }

  const existingSession = sessions.get(username)?.[0];
  if (existingSession) {
    return { sessionToken: existingSession.sessionToken, clientId: existingSession.clientId };
  }

  const sessionToken = createUuidSessionTokenGenerator().generate();
  const clientId = createRandomClientIdGenerator().generate(10);
  const sessionData = {
    "sessionToken": sessionToken,
    "username": username,
    "clientId": clientId,
    "createdAt": new Date(),
  };

  sessions.set(username, [sessionData]);

  return { sessionToken, clientId };
}

function getClientIds(username, sessions) {
  return sessions.get(username)?.map((sessionData) => sessionData.clientId) || [];
}

function getSessionTokens(username, sessions) {
  return sessions.get(username)?.map((sessionData) => sessionData.sessionToken) || [];
}

function createSessionRepositoryWithClient(username, clientId) {
  if (!username || !username.match(/^[a-zA-Z0-9]+$/)) {
    throw new Error('Username is required', { statusCode: 400 });
  }

  if (username.toLowerCase() === 'dog') {
    throw new Error('Username "dog" is not allowed', { statusCode: 403 });
  }

  const existingSession = sessions.get(username)?.find((data) => data.clientId === clientId);
  if (existingSession) {
    return existingSession.sessionToken;
  }

  const sessionToken = createUuidSessionTokenGenerator().generate();
  const sessionData = {
    "sessionToken": sessionToken,
    "username": username,
    "clientId": clientId,
    "createdAt": new Date(),
  };

  if (sessions.has(username)) {
    sessions.get(username).push(sessionData);
  } else {
    sessions.set(username, [sessionData]);
  }

  return sessionToken;
}

function getAllSessionsData(username) {
  return new Promise((resolve, reject) => {
    try {
      const sessionData = sessions.get(username);
      if (sessionData) {
        resolve(sessionData);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function removeSession(username, sessionToken) {
  return new Promise((resolve, reject) => {
    const sessionData = sessions.get(username);
    if (sessionData) {
      const sessionTokens = getSessionTokens(username, sessions);
      if (sessionTokens.includes(sessionToken)) {
        sessions.set(username, sessionData.filter((data) => data.sessionToken !== sessionToken));
        resolve();
      } else {
        reject('Session not found');
      }
    } else {
      reject('Session not found');
    }
  });
}

function removeClientId(username, clientId) {
  return new Promise((resolve, reject) => {
    const sessionData = sessions.get(username);
    if (sessionData) {
      const clientIds = getClientIds(username, sessions);
      if (clientIds.includes(clientId)) {
        sessions.set(username, sessionData.filter((data) => data.clientId !== clientId));
        resolve();
      } else {
        reject('Client Id not found');
      }
    } else {
      reject('Client Id not found');
    }
  });
}

function login(req, res) {
  return new Promise((resolve, reject) => {
    const username = req.body.username;

    if (!username || !username.match(/^[a-zA-Z0-9]+$/)) {
      return reject({ status: 400, error: 'Enter valid Username' });
    }

    if (username.toLowerCase() === 'dog') {
      return reject({ status: 403, error: 'Username "dog" is not allowed' });
    }

    try {
      const { sessionToken, clientId } = createSessionRepository(username);
      res.cookie('sessionToken', sessionToken, { httpOnly: true });
      resolve({ status: 200, data: { username, sessionToken, clientId } });
    } catch (error) {
      console.error('Network error:', error);
      reject({ status: 500, error: 'Network error occurred' });
    }
  })
  .then(({ status, data }) => {
    res.status(status).json(data);
  })
  .catch(({ status, error }) => {
    res.status(status).json({ error });
  });
}


function logout(req, res) {
  return new Promise((resolve, reject) => {
    try {
      const sessionToken = req.cookies.sessionToken;
      let isSessionFound = false;
      for (const [key, dataArray] of sessions) {
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].sessionToken === sessionToken) {
            dataArray.splice(i, 1);
            isSessionFound = true;
            break;
          }
        }
      }
      if (!isSessionFound) {
        reject({ error: 'auth-missing', statusCode: 401 });
        return;
      }

      res.clearCookie('sessionToken');
      res.json({ message: 'Logout successful' });
      resolve();
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
      reject(error);
    }
  });
}

function validateSession(username, sessionToken) {
  return new Promise((resolve, reject) => {
    try {
      const sessionIds = getSessionTokens(username, sessions);
      if (sessionIds.includes(sessionToken)) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(new Error('Session validation failed', { statusCode: 500 }));
    }
  });
}

function getSessionData(username, sessionToken) {
  return new Promise((resolve, reject) => {
    const sessionData = sessions.get(username);
      if (sessionData) {
        const session = sessionData.find((data) => data.sessionToken === sessionToken);
        if (session) {
          resolve(session);
        } else {
          reject(new Error('Session not found', { statusCode: 404 }));
        }
      } else {
        reject(new Error('Session not found', { statusCode: 404 }));
      }
  });
}

function getMessages(username, clientId) {
  return new Promise((resolve, reject) => {
    try {
      const messageData = messages.get(`${username}:${clientId}`);
      if (messageData) {
        resolve(messageData);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(new Error('Server error: ' + error.message));
    }
  });
}

function sendMessage(username, clientId, message) {
  return new Promise((resolve, reject) => {
    try {
      const messageData = messages.get(`${username}:${clientId}`) || [];
      messageData.push({ sender: username, content: message });
      messages.set(`${username}:${clientId}`, messageData);
      resolve();
    } catch (error) {
      reject(new Error('Server error: ' + error.message));
    }
  });
}

function getAllMessages() {
  return new Promise((resolve, reject) => {
    try {
      const allMessages = [];
      for (const [key, messageData] of messages) {
        allMessages.push(...messageData);
      }
      resolve(allMessages);
    } catch (error) {
      reject(new Error('Server error: ' + error.message));
    }
  });
}

module.exports = {
  createSessionRepository,
  createSessionRepositoryWithClient,
  getAllSessionsData,
  removeSession,
  removeClientId,
  login,
  logout,
  validateSession,
  getSessionData,
  getMessages,
  sendMessage,
  getAllMessages
};