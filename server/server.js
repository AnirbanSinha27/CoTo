import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import ACTIONS from './Actions.js'; // Adjust the path as needed

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Serve static files from the '../dist' directory
app.use(express.static(distPath));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const userSocketMap = {};

// Function to get all connected clients in a room
function getAllConnectedClients(roomId) {
  const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
  return clients;
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // Handle join room action
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });

    // Handle code change events from client
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code, language }) => {
      // Broadcast the received code to all users in the room except the sender
      socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code, language });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);

      // Clean up userSocketMap and notify room members about disconnection
      if (userSocketMap[socket.id]) {
        const username = userSocketMap[socket.id];
        delete userSocketMap[socket.id];
        io.to(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username,
        });
      }
    });
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
