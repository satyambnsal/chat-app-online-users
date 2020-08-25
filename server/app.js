const express = require('express');
const http = require('http');

const socketIo = require('socket.io');

const port = process.env.PORT || 4001;

const app = express();
app.get('/', (req, res) => {
  res.send({ response: 'I am alive!' }).status(200);
});

const server = http.createServer(app);

const io = socketIo(server);

let interval;

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit('FromAPI', response);
};

io.on('connection', (socket) => {
  console.log('New client connected');
  const onlineUsers = Object.keys(io.engine.clients);
  io.emit('onlineUsers', JSON.stringify(onlineUsers));
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 5000);
  socket.on('disconnect', () => {
    const onlineUsers = Object.keys(io.engine.clients);
    io.emit('onlineUsers', JSON.stringify(onlineUsers));
    console.log('Client disconnected');
    clearInterval(interval);
  });

  return () => socket.disconnect();
});

server.listen(port, () => console.log(`Listening on port ${port}`));
