// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // allow cross-origin

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // React app origin
    methods: ['GET', 'POST']
  }
});

// When client connects
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('send_message', (data) => {
    console.log('Message from client:', data);

    // Send a response back to client
    setTimeout(()=> {socket.emit('receive_message', `You told '${data}'`)}, 1000)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
