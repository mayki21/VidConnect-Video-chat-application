const express = require("express");
const app = express();
const socketio = require("socket.io");
require("dotenv").config()
const http = require("http");
const {
  userJoin,
  getRoomUsers,
  getCurrentUser,
  userLeave,
} = require("./routes/users");
const formateMessage = require("./routes/messages");

// server connection

const server = http.createServer(app);
const io = socketio(server);

app.get('/start', (req, res) => {
  res.send("welcome to chat server");
})



io.on("connection", (socket) => {
  console.log("One user has joined");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome message
    socket.emit(
      "message",
      formateMessage("Server ", " Welcome to Real Talk Application")
    );

    // Broadcasting other users
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formateMessage("Server", `${username} has joined the chat`)
      );

    // getting room users.
    io.to(room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formateMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    console.log("one user left");

    if (!user || !user.room)
    {
      return;
    }

    // Broadcastion other users on leaving
    io.to(user.room).emit(
      "message",
      formateMessage("Server", `${user.username} has left the chat`)
    );

    // getting room users.
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});

// const PORT = 5000;

server.listen(process.env.port, () => {
  console.log(`server is running on port ${process.env.port}`);
});
