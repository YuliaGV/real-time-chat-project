const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO and allow requests from the frontend origin.
const io = new Server(server, {
  cors: { origin: "http://localhost:4200" }
});

io.on("connection", (socket) => {
  const username =
    (socket.handshake && socket.handshake.auth && socket.handshake.auth.username) ||
    `User_${socket.id.substring(0, 5)}`;
  socket.username = username;

  socket.broadcast.emit("user_connected", { id: socket.id, username });

  socket.on("message", (data) => {
    const payload = { ...data, from: { id: socket.id, username } };
    io.emit("message", payload);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user_disconnected", { id: socket.id, username });
  });
});

// Start the server on port 3000
server.listen(3000, () => console.log("Socket.IO server running on port 3000"));
