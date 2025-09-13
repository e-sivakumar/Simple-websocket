// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const dotenv = require("dotenv")

dotenv.config( { quiet: true, debug: false } );

const db = require("./db");
const { validateJWT } = require('./src/middlewares/authenticationMiddleware');
const { updateSocket, findUserSocketId, disconnectUser } = require('./src/controllers/userController');
const { storeMessage } = require('./src/controllers/messageController');
const userRouter = require('./src/routes/userRoutes');
const messageRouter = require('./src/routes/messageRoutes');

const app = express();
app.use(cors()); // allow cross-origin
app.use(express.json())
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // React app origin
    methods: ['GET', 'POST']
  }
});

// When client connects
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('send_message', (data) => {
//     console.log('Message from client:', data);

//     // Send a response back to client
//     setTimeout(()=> {socket.emit('receive_message', `You told '${data}'`)}, 1000)
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });
// });

io.on('connection', (socket) => {

  // 🔑 Authenticate user with token after connecting
  socket.on('authenticate', async (token) => {
    try {
      const data = validateJWT(token); // extract payload
      if (!data || !data.id) {
        console.log("❌ Invalid token for socket:", socket.id);
        socket.emit("app_error", { message: "Authentication failed" });
        socket.disconnect();
        return;
      }

      const userId = data.id;
      await updateSocket(userId, socket.id);
      socket.data.userId = userId; // store in memory for later
    } catch (err) {
      console.error("Auth error:", err);
      socket.emit("app_error", { message: "Server auth error" });
      socket.disconnect();
    }
  });

  // ✉️ Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { token, to, content } = data;
      if (!token || !to || !content) {
        return socket.emit("app_error", { message: "Invalid message payload" });
      }

      // validate sender
      const senderData = validateJWT(token);
      if (!senderData || !senderData.id) {
        return socket.emit("app_error", { message: "Invalid token" });
      }
      const from = senderData.id;

      // 1. Store in DB
      await storeMessage(content, from, to);

      // 2. Find receiver's socket
      const receiverSocketId = await findUserSocketId(to);

      if (receiverSocketId) {
        // 3. Deliver message
        io.to(receiverSocketId).emit("receive_message", {
          sender: from,
          content,
          createdAt: new Date()
        });
      } 

      // Acknowledge sender
      socket.emit("message_sent", { to, content });

    } catch (err) {
      console.error("Message send error:", err);
      socket.emit("app_error", { message: "Failed to send message" });
    }
  });

  // ❌ Handle disconnect
  socket.on('disconnect', async () => {
    try {
      const userId = socket.data?.userId;
      if (userId) {
        await disconnectUser(userId);
      } else {
        console.log(`⚡ Unknown user disconnected, socket ${socket.id}`);
      }
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  });
});

db().then(()=>{}).catch((err)=>console.log("error in db", err))

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
