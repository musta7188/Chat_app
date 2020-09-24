////this file represent the client side

const socket = io();


document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;



  socket.emit("sendMessage", message, (msgServer) =>{
   if(msgServer){
     return console.log(msgServer)
   }
   console.log('Message delivered')
  });
});


document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation is not supported  by this browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const data = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit("UserLocation", data, (msgServer) =>{
      
      console.log(' you shared your location ')
      console.log(msgServer)
    });
  });
});

socket.on("messageToAllUsers", (message) => {
  console.log(message);
});


socket.on("sendLocation", (msg) => {
  console.log(msg);
});


socket.on("message", (message) => {
  console.log(message);
});

socket.on("welcome", (msg) => {
  console.log(msg);
});

socket.on("disconnect", (msg) => {
  console.log(msg);
});



// server (emit) -> client (receive) ---acknowledgment --> server
// client (emit) -> sever (receive) --acknowledgment --> client