export const login = (username) => {
    return fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          throw new Error(error.error);
        });
      }
    })
    .catch((error) => {
      console.error('Login failed:', error);
      throw error;
    });
};

export const logout = () => {
  return fetch('/api/logout', {
    method: 'POST',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((error) => {
          throw new Error(error.error);
        });
      }
    })
    .catch((error) => {
      console.error('Logout failed:', error);
      throw error;
    });
};

export const validateSession = (username, sessionToken) => {
  return fetch('/api/validate-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, sessionToken }),
  })
    .then((response) => response.json())
    .then((data) => data.valid)
    .catch((error) => {
      console.error('Session validation failed:', error);
      throw error;
    });
};

export const getClientId = (username, sessionToken) => {
    return fetch('/api/get-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, sessionToken }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => data.sessionData.clientId);
        } else if (response.status === 401) {
          return response.json().then((error) => {
            console.error('Session expired:', error);
            throw new Error('Session expired: ' + error.error);
          });
        } else {
          return response.json().then((error) => {
            console.error('Server error:', error);
            throw new Error('Server error: ' + error.error);
          });
        }
      })
      .catch((error) => {
        console.error('Failed to get client ID:', error);
        throw error;
      });
};

export const getAllSessions = (username) => {
  return fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => data.sessions);
      } else {
        return response.json().then((error) => {
          throw new Error(error.error);
        });
      }
    })
    .catch((error) => {
      console.error('Failed to fetch sessions:', error);
      throw error;
    });
};