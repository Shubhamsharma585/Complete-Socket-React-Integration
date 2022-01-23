const express = require("express");
const app = express();
const cors = require("cors")

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(cors())
app.use(express.json());  

const io = new Server(server, {  
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }  
});

var users = [];
var mess = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});   
 

io.on("connection", (socket) => { 
  console.log("A user is conneced");


   //sirf usko jisne connection banaya h, sending
   //list of all users 
  socket.emit("all-users", users)


  socket.on("new-user-joined", username => {
    console.log(username)
    users = [...users, {name: username, id: socket.id}];
    //sbko
    io.emit("all-users", users)
  //users[socket.id] = user; 
  //socket se connection h un sbko but sender
  socket.broadcast.emit("user-joined", [...mess, {mes:`${username} joined the chat`, name: username}]);
  })
 

  socket.on("chat-message", (mes) => {
    console.log(mes)
    mess = [...mess, mes]
    //io.emit (sbko jayega)
    io.emit("chat-message", mess);
    //socket.emit (sirf socket ko jayega)
  }); 
 
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
    // socket.emit(`${users[socket.id]} left`)
    // delete users[socket.id];
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});



// const io = require('socket.io')(PORT)
// console.log("connected to", PORT)

// io.on('connection', socket => {
//   console.log(socket, "new user connected")
//   //client se jo clientId hm bna k bhej rhe h
//   //perticular user ki
//   const id = socket.handshake.id

//   //socket id static banane k liye taki jb bhi agli
//   //bar socket connection bne same id se bne
//   //socket.join(id)
//   socket.on('send-message', ({recipients, text}) => {
//      console.log(recipients, text)
//   //   newrecipients = recipients;
//   //   socket.broadcast.to(recipients).emit('receive-message', {
//   //     recipients: newrecipients, sender: id, text
//   //   })
// })
// })
