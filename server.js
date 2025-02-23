const express = require('express');
const cookieParser = require('cookie-parser');
const { validateSession, createSessionRepository, createSessionRepositoryWithClient, getAllSessionsData, removeSession, removeClientId, login, logout, getSessionData, getMessages, sendMessage, getAllMessages } = require('./src/auth-controller');
const app = express();
const path = require('path');

app.use(express.json());
app.use(cookieParser());
const port = 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/login', (req, res) => {
  login(req, res)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        res.status(400).json({ error: 'Username is required' });
      } else if (error.statusCode === 403) {
        res.status(403).json({ error: 'Username "dog" is not allowed' });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Network error occurred' });
      }
    });
});

app.post('/api/logout', (req, res) => {
  logout(req, res)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      if (error.statusCode === 401) {
        res.status(401).json({ error: 'auth-missing' });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Logout failed' });
      }
    });
});

app.post('/api/sessions', (req, res) => {
  const username = req.body.username;
  getAllSessionsData(username)
    .then((activeSessions) => {
      if (activeSessions.length === 0) {
        res.status(404).json({ error: 'No active sessions found for the user' });
      } else {
        res.status(200).json({ sessions: activeSessions });
      }
    })
    .catch((error) => {
      console.error(error);
      console.error('Network error:', error);
      res.status(500).json({ error: 'Failed to retrieve active sessions' });
    });
});

app.post('/api/validate-session', (req, res) => {
  const { username, sessionToken } = req.body;
  validateSession(username, sessionToken)
    .then((isValid) => {
      if (isValid) {
        res.status(200).json({ valid: true });
      } else {
        res.status(401).json({ error: 'Invalid session' });
      }
    })
    .catch((error) => {
      console.error('Network error:', error);
      res.status(500).json({ error: 'Session validation failed' });
    });
});

app.post('/api/get-session', (req, res) => {
  const { username, sessionToken } = req.body;
  getSessionData(username, sessionToken)
    .then((sessionData) => {
      if (sessionData) {
        res.status(200).json({ sessionData });
      } else {
        res.status(404).json({ error: 'No active sessions found for the user' });
      }
    })
    .catch((error) => {
      if (error.statusCode === 404) {
        res.status(404).json({ error: 'Session not found' });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Failed to get session' });
      }
    });
});

app.post('/api/create-session', (req, res) => {
  const { username } = req.body;
  createSessionRepository(username)
    .then((sessionToken) => {
      res.status(200).json({ sessionToken });
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        res.status(400).json({ error: 'Username is required' });
      } else if (error.statusCode === 403) {
        res.status(403).json({ error: 'Username "dog" is not allowed' });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Failed to create session' });
      }
    });
});

app.post('/api/create-session-with-clientId', (req, res) => {
  const { username, clientId } = req.body;
  createSessionRepositoryWithClient(username, clientId)
    .then((sessionToken) => {
      if (typeof sessionToken === 'string') {
        res.status(400).json({ error: sessionToken });
      } else {
        res.status(200).json({ sessionToken });
      }
    })
    .catch((error) => {
      if (error.statusCode === 400) {
        res.status(400).json({ error: 'Username is required' });
      } else if (error.statusCode === 403) {
        res.status(403).json({ error: 'Username "dog" is not allowed' });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Failed to create session' });
      }
    });
});

app.post('/api/remove-session', (req, res) => {
  const { username, sessionToken } = req.body;
  removeSession(username, sessionToken)
    .then(() => {
      res.status(200).json({ message: 'Session removed' });
    })
    .catch((error) => {
      if (error === 'Session not found') {
        res.status(404).json({ error: 'Session not found' });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Failed to remove session' });
      }
    });
});

app.post('/api/remove-clientId', (req, res) => {
  const { username, clientId } = req.body;
  removeClientId(username, clientId)
    .then(() => {
      res.status(200).json({ message: 'ClientId removed' });
    })
    .catch((error) => {
      if (error === 'Client Id not found') {
        res.status(404).json({ error: 'Client Id not found' });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Failed to remove clientId' });
      }
    });
});

app.get('/api/messages/:username/:clientId', (req, res) => {
  const { username, clientId } = req.params;
  getMessages(username, clientId)
    .then((messages) => {
      res.status(200).json({ messages });
    })
    .catch((error) => {
      if (error.message.startsWith('Session expired:')) {
        res.status(401).json({ error: error.message });
      } else if (error.message.startsWith('Server error:')) {
        res.status(500).json({ error: error.message });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
      }
    });
});

app.post('/api/messages/:username/:clientId', (req, res) => {
  const { username, clientId } = req.params;
  const { message } = req.body;
  sendMessage(username, clientId, message)
    .then(() => {
      res.status(200).json({ message: 'Message sent' });
    })
    .catch((error) => {
      if (error.message.startsWith('Session expired:')) {
        res.status(401).json({ error: error.message });
      } else if (error.message.startsWith('Server error:')) {
        res.status(500).json({ error: error.message });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Failed to send message' });
      }
    });
});

app.get('/api/messages', (req, res) => {
  getAllMessages()
    .then((messages) => {
      res.status(200).json({ messages });
    })
    .catch((error) => {
      if (error.message.startsWith('Session expired:')) {
        res.status(401).json({ error: error.message });
      } else if (error.message.startsWith('Server error:')) {
        res.status(500).json({ error: error.message });
      } else {
        console.error('Network error:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
      }
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});