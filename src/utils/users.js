////keep track fo the users 

const users = []

///addUser,
///RemoveUser,
////getUSer,
////getUsersInRoom


const addUser = ({id, username, room}) =>{
    //// Clean the data 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    ////Validate the data
    if(!username || !room ){
      return {
        error: 'Username and Room are required'
      }
    }

    ///Check for existing users 
    const existingUser = users.find((user) =>{
      return user.room === room && user.username === username
    })

    /// Validate username
    if(existingUser) {
      return {
        error: 'Username is already taken!'
      }
    }

    //store user

    const user = {id,username,room}
    users.push(user)
    return {user}

}


const RemoveUser = (id) =>{
  const index = users.findIndex((user) => user.id === id);
  if(index !== -1) {
    return users.splice(index, 1)[0]
  } 
}


const getUSer = (id) =>{

return users.find((user) => user.id === id)

}


const getUsersInRoom = (room) =>{
return users.filter((user) => user.room === room  )

}



module.exports = {
  getUsersInRoom,
  getUSer,
  RemoveUser,
  addUser

}
