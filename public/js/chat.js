////this file represent the client side

const socket = io();

const $messageForm  = document.querySelector("#message-form")
const $messageFormInputs = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')
const $messageTemplate = document.querySelector('#message-template').innerHTML

const $locationTemplate = document.querySelector('#location-url').innerHTML
const $locationAnchor = document.querySelector('#location-anchor')


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

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render($messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  })
  $messages.insertAdjacentHTML('beforeend', html)
});


socket.on('location', (message) =>{
  console.log(message)

  const html = Mustache.render($locationTemplate, {
    location: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
    message: "My Location"
  })

$messages.insertAdjacentHTML('beforeend', html)

})


// server (emit) -> client (receive) ---acknowledgment --> server
// client (emit) -> sever (receive) --acknowledgment --> client