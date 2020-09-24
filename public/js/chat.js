////this file represent the client side

const socket = io();

const $messageForm  = document.querySelector("#message-form")
const $messageFormInputs = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  ///disable 
  $messageFormButton.disabled = true

  const message = e.target.elements.message.value;



  socket.emit("sendMessage", message, (msgServer) =>{
    $messageFormButton.disabled  = false
    $messageFormInputs.value = ''
    $messageFormInputs.focus()
    ///enable
   if(msgServer){
     return console.log(msgServer)
   }
   console.log('Message delivered')
  });


});


$locationButton.addEventListener("click", () => {
 
  if (!navigator.geolocation) {
    return alert("geolocation is not supported  by this browser");
  }
 $locationButton.disabled = true
  navigator.geolocation.getCurrentPosition((position) => {
    const data = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit("UserLocation", data, (msgServer) =>{
      
      console.log(' you shared your location ')

      if(msgServer){
        console.log(msgServer)
        $locationButton.disabled = false
      }


      
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