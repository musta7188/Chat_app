////this file represent the client side

const socket = io();

///Elements
const $messageForm  = document.querySelector("#message-form")
const $messageFormInputs = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $locationAnchor = document.querySelector('#location-anchor')
///Templates
const $messages = document.querySelector('#messages')

const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-url').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
///help to parse the query and ignore the unnecessary symbols
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})



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





const autoscroll = () =>{
// New message element //grab the last message sent
const $newMessage = $messages.lastElementChild

//Hight of the new message
const newMessageStyles = getComputedStyle($newMessage)///grab all element
const newMessageMargin = parseInt(newMessageStyles.marginBottom) //get margin value 
const newMessageHeigh = $newMessage.offsetHeight + newMessageMargin //add margin to the hight getting the total
///60

//Visible hight, is the amount of space I can see on the screen
const visibleHight = $messages.offsetHeight
console.log(visibleHight)
// hight of message container 
const containerHeight = $messages.scrollHeight//how much height we can scroll through 


// how far have i scrolled?

const scrollOffset = $messages.scrollTop + visibleHight //the amount of distance we scrolled from the top

////check if user where at the bottom before last message was added 
// console.log(containerHeight - newMessageHeigh)
// console.log(scrollOffset)
if (containerHeight - newMessageHeigh <= scrollOffset) {
  ///this will push the scroll automatically  down 
  $messages.scrollTop = $messages.scrollHeight
}

}




socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render($messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
    username: message.username
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
});


socket.on('location', (message) =>{
  console.log(message)

  const html = Mustache.render($locationTemplate, {
    location: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
    message: "My Location",
    username: message.username
  })

$messages.insertAdjacentHTML('beforeend', html)
autoscroll()

})

socket.on('roomData', ({room, users}) => {

const html = Mustache.render(sideBarTemplate, {
  room,
  users
})
document.querySelector("#sidebar").innerHTML = html

})



socket.emit('join', {username, room}, (error) =>{
if(error){
  alert(error)
  location.href = '/'
}
})


// server (emit) -> client (receive) ---acknowledgment --> server
// client (emit) -> sever (receive) --acknowledgment --> client