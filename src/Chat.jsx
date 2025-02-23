import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { getMessages, sendMessage, getAllMessages, generateAnonymousUsername } from './ChatService';
import './Chat.css';

const Chat = ({ changePage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { state, logout } = useContext(AuthContext);
  const [anonymousUsername, setAnonymousUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = () => {
      setIsLoading(true);
      getAllMessages()
        .then((messages) => {
          setMessages(messages);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to retrieve messages:', error);
          setIsLoading(false);
        });
    };

    if (!anonymousUsername) {
      setAnonymousUsername(generateAnonymousUsername());
    }

    fetchMessages();
  }, [anonymousUsername]);

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setIsLoading(true);
      sendMessage(anonymousUsername, state.clientId, newMessage)
        .then(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: anonymousUsername, content: newMessage },
          ]);
          setNewMessage('');
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to send message:', error);
          setIsLoading(false);
        });
    }
  };

  const handleLogout = () => {
    return logout()
      .then(() => {
        changePage('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        throw error;
      });
  };

  return (
    <div className="chat">
      <div className="welcome-message">
        Welcome, {anonymousUsername}!
      </div>
      {isLoading ? (
        <div className="loading-indicator">
          <div className="gg-spinner-two"></div>
        </div>
      ) : (
        <div className="chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === anonymousUsername ? 'sent' : 'received'}`}>
              <span className="sender">{message.sender}:</span> {message.content}
            </div>
          ))}
        </div>
      )}
      <div className="input-container">
        <input type="text" value={newMessage} onChange={handleMessageChange} placeholder="Enter your message"/>
        <button onClick={handleSendMessage}>Send</button>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Chat;
