import React, { useState, useEffect, useContext } from 'react';
import Login from './Login';
import ClientIdPage from './ClientIdPage';
import Chat from './Chat';
import { AuthContext } from './AuthContext';
import './App.css';

function App() {
  const [page, setPage] = useState(document.location.pathname);
  const { state } = useContext(AuthContext);

  useEffect(() => {
    const handlePopState = () => {
      setPage(document.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const changePage = (path) => {
    setPage(path);
  };

  return (
    <div className="app">
      {page === '/' && <Login changePage={changePage} />}
      {page === '/client-id' && <ClientIdPage changePage={changePage} clientId={state.clientId} />}
      {page === '/chat' && <Chat changePage={changePage}/>}
    </div>
  );
}

export default App;
