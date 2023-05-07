const express = require("express");
const app = express();
require("dotenv").config({ path: "./.env" });
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const connectDB = require("./helpers/db.helper");
const apiRoute = require("./routes/router.js");
const { runCronJobs } = require("./services/cron.service");
const { getObjectKey } = require("./helpers/utils.helper");

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://teamconnect-frontend.vercel.app",
      "http://teamconnect-frontend.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://teamconnect-frontend.vercel.app",
      "http://teamconnect-frontend.vercel.app",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// connect to the database
connectDB();

app.use("/", apiRoute);

runCronJobs();

let onlineUsers = {};

let onlineChannelUsers = {};

io.on("connection", (socket) => {
  socket.on("addUser", (email) => {
    onlineUsers[socket.id] = email;
  });

  socket.on("removeUser", () => {
    delete onlineUsers[socket.id];
  });

  socket.on("sendInvitation", (emails) => {
    emails.map((email) => {
      const socketIds = getObjectKey(onlineUsers, email);
      io.to(socketIds).emit("getInvitations", {
        email,
      });
    });
  });

  socket.on("sendComment", (members) => {
    const emails = [];
    members.map((member) => {
      emails.push(member.user.email);
    });
    emails.map((email) => {
      const socketIds = getObjectKey(onlineUsers, email);
      io.to(socketIds).emit("getComment", {
        email,
      });
    });
  });

  socket.on("addUnreadMessage", (channelMembers) => {
    const emails = [];
    channelMembers.map((member) => {
      emails.push(member.user.email);
    });
    emails.map((email) => {
      const socketIds = getObjectKey(onlineUsers, email);
      io.to(socketIds).emit("getUnreadMessage", {
        email,
      });
    });
  });

  socket.on("sendMessage", (channelMembers) => {
    const emails = [];
    channelMembers.map((member) => {
      emails.push(member.user.email);
    });
    emails.map((email) => {
      const socketIds = getObjectKey(onlineUsers, email);
      io.to(socketIds).emit("getMessage", {
        email,
      });
      io.to(socketIds).emit("getUnreadMessage", {
        email,
      });
    });
  });

  socket.on("updateBoard", (members) => {
    const emails = [];
    members.map((member) => {
      emails.push(member.user.email);
    });
    emails.map((email) => {
      console.log({ email });
      const socketIds = getObjectKey(onlineUsers, email);
      io.to(socketIds).emit("getNewBoard", {
        email,
      });
    });
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
  });
});

server.listen("5000", () => console.log("Server running on port 5000"));
