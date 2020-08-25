import React, { useState, useEffect } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://127.0.0.1:4001';

function App() {
  const [response, setResponse] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('FromAPI', (data) => {
      setResponse(data);
    });
    socket.on('onlineUsers', (message) => {
      const users = JSON.parse(message);
      setOnlineUsers(users);
    });
    return () => socket.disconnect();
  }, []);
  const onlineUsersList = onlineUsers.map((onlineUser) => (
    <li>{onlineUser}</li>
  ));

  return (
    <div>
      Its <time dateTime={response}>{response}</time>
      <ul>{onlineUsersList}</ul>
    </div>
  );
}

export default App;
