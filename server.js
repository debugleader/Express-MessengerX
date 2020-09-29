const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const moment = require("moment");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require("./config/auth.js");
const users = [];

// Passport Config
require("./config/passport")(passport);

// DB Config
// const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/express", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/users", require("./routes/users.js"));

// Welcome Page
app.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
// app.get("/dashboard", ensureAuthenticated, (req, res) =>
//   res.render("dashboard", {
//     user: req.user,
//   })
// );

// Dashboard
app.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.redirect("/main.html");
});

app.get("/main.html", ensureAuthenticated, (req, res) => {
  res.render("main", { user: req.user });
});

app.get("/style.css", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/" + "dist/style.css");
});

app.get("/main.js", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/" + "dist/main.js");
});

app.get("/chat.html", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/" + "dev/chat.html");
});

const botName = "MessengerX Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to MessengerX!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT_server = process.env.PORT_server || 3000;

server.listen(PORT_server, () =>
  console.log(`First Server running on port ${PORT_server}`)
);
