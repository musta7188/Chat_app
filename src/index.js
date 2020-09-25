const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const { getUsersInRoom, getUSer, RemoveUser, addUser }  = require('./utils/users')
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
/// socket.emit (send event to a specific clients)
/// socket.io (send event to all the clients)
////socket.broadcast.emit(send to all clients except the one who sent it)
//// ----- after using socket.join() ----- 
////io.to.emit (emit event to everybody into a specific room)
///socket.broadcast.to.emit (emit event to everyone in a specific chat room expect who sent it)
  console.log("New WebSocket connection");


socket.on('join', ({username, room}, callback) =>{

  const {error, user} =  addUser({id: socket.id, username, room})

  if(error){
  return  callback(error)
  }


  
  socket.join(user.room)

  socket.emit("message", generateMessage(`Welcome ${user.username}`));
  socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined`, user.username));

  callback()
})




  socket.on("sendMessage", (msg, callback) => {
    const user = getUSer(socket.id)
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      return callback("Profanity is not allowed!!");
    }
    io.emit("message", generateMessage(msg, user.username));
    callback();
  });





  socket.on("disconnect", () => {
   const user =  RemoveUser(socket.id)

   if(user){
    return io.to(user.room).emit("message", generateMessage(`${user.username} has left`, user.username));
   }
    
   
  });


  socket.on("UserLocation", (data, callback) => {
    const user = getUSer(socket.id)
    if(user) {

      io.to(user.room).emit(
      "location",
      generateLocationMessage(`https://google.com/maps?q=${data.latitude},${data.longitude}`, user.username)
    );

    callback('location shared successfully with other users ')
    }
    
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
