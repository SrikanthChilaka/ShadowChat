# Final Project

## Chat Application 

## The Chat Application is a real-time chat platform that allows users to communicate with each other. It provides features for user authentication, session management, and message exchange.

## Server

### The project is a express-based NodeJS server. It exposes the following API endpoints:

Endpoint                           | Method  | Description                                        | Access Restriction |
:---------:                        |:------: | :----------:                                       |:------------------:|
/api/login                         | POST    | Handles user login and creates a new session       | Public             |
/api/logout                        | POST    |Handles user logout and removes the session         | Authenticated      |
/api/sessions                      | POST    |Retrieves all active sessions for a user            | Authenticated      |
/api/validate-session              | POST    |Validates the user's session token                  | Authenticated      |
/api/get-session                   | POST    |Retrieves the session data for a user               | Authenticated      |
/api/create-session                | POST    |Creates a new session for a user                    | Authenticated      |
/api/create-session-with-clientId  | POST    |Creates a new session with a client ID              | Authenticated      |
/api/remove-session                | POST    |Removes a session for a user                        | Authenticated      |
/api/remove-clientId               | POST    |Removes a client ID for a user                      | Authenticated      |
/api/messages/:username/:clientId  | GET     |Retrieves messages for a specific user and client ID| Authenticated      |
/api/messages/:username/:clientId  | POST    |Sends a message for a specific user and client ID   | Authenticated      |
/api/messages                      | GET     |Retrieves all messages                              | Authenticated      |

* Users have an authentication step
* Used fetch() and promises directly.
* All authenticated users have access to the same set of endpoints.
* The server implements service pagination for the /api/messages endpoint.
* Banned user "dog" and validated the username.
* Message History: Users can view the complete message history for the chat, regardless of their current session.
* Displaying the loading indicator while the messages are being fetched or a message is being sent.

### Client ID Generation and Session Management

* When a user first accesses the application, the client-side code generates a unique client ID for them. This client ID is a randomly generated string of 10 alphanumeric characters
* The chat application utilizes cookie to manage user sessions. When a user logs in, the server creates a new session for the user and generates a unique session token. This session token is then stored in a cookie on the user's browser.
* On subsequent requests, the client's browser automatically sends the session cookie back to the server. The server can then use the session token in the cookie to look up the user's session data and authenticate the user.

## Client

* The client-side of the application is built using React. It consists of the following views:
    * Login View:
         -Allows users to log in with their username.
         -Displays an error message if the username is invalid or not allowed.
    * Client ID View:
         -Displays the user's client ID.
         -Allows the user to log in with their username.
    * Chat View:
         -Displays the chat messages for the user's current session.
         -Allows the user to send new messages.
         -Provides a logout button to end the current session.
* The project runs with `npm install`, `npm run build`, `npm start`
* The application can be tested by running `npm install` and running `npm start` to start the services server on port 3000
   -running (in a separate terminal) npm run dev to start the Vite dev server on port 5173
   -visiting http://localhost:5173 in the browser
* The application can also work by:
   -running `npm run build` to create the static files in dist/
   -running `npm start` to start the express server (and NOT running the Vite dev server)
   -visiting http://localhost:3000 in the browser

### The following hooks are utilized:

* useState:    The useState hook is used to manage the local state of components, such as the username input, error messages, and new message content.
* useEffect:   The useEffect hook is used to fetch and update the chat messages, as well as to set up and clean up event listeners for the browser's popstate event
* useContext:  The useContext hook is used to access the AuthContext, which provides the authentication-related state and functions, such as login, logout, and session validation.
* useReducer:  The useReducer hook is used in the AuthContext to manage the authentication state, including the user's login status, username, and client ID.

#### Background image source: https://github.com/Gowee/nyancat-svg
