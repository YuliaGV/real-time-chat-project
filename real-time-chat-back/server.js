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
  // Fired when a client connects
  console.log("Usuario conectado:", socket.id);

  // Listen for a 'mensaje' event from the client.'data' should contain the message payload sent by the client.
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);

    // Broadcast the received message to all connected clients.
    io.emit("mensaje", data);
  });
  // Fired when the client disconnects
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Start the server on port 3000
server.listen(3000, () => console.log("Servidor Socket.IO en puerto 3000"));
