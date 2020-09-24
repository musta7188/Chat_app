const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {generateMessage} = require('./utils/messages')

const app = express();
///allow co create a new web server, this manual set up usually done behind the scene from express, however to user socket.io we need to do it
///manually otherwise we wont have access to this and been able to pass it to the socketio() function below
const server = http.createServer(app);

///now our server support web socket
const io = socketio(server);

const port = process.env.PORT || 3000;

////render the html file in the public folder
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));


io.on("connection", (socket) => {

  console.log("New WebSocket connection");
  socket.emit("message", generateMessage("welcome"));


  ///send it to every clients expect the current socket (user)
  socket.broadcast.emit("message", generateMessage("a new user has joined"));


  socket.on("sendMessage", (msg, callback) => {
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      return callback("Profanity is not allowed!!");
    }
    io.emit("message", generateMessage(msg)); ////send the message to all users connect
    callback();
  });



  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left"));
  });




  socket.on("UserLocation", (data, callback) => {
    socket.broadcast.emit(
      "location",
      `https://google.com/maps?q=${data.latitude},${data.longitude}`
    );

    callback('location shared successfully with other users ')
  });
});





server.listen(port, () => {
  console.log("Chat app is up to " + port);
});

//// create an express web server

//1. Initialize npm and install Express
// 2.Setup a new Express server
//  - Serve up the public O_DIRECTORY  - Listen on port 3000
//  3. Create index.html in the public folder and render "Chat app" to the screen
//  4. Test your work! Start the server and view the page in the browser

//// setup script in package.json
//// 1.create a "start" script to start the app using node
// 2. install nodemon and development dependency
// 3. Create a "dev" script to start the app using nodemon
// 4. Run both scripts to test your work!
