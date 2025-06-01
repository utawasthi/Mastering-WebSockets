const express = require('express');
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = new Server(server , {
  cors : {
    origin : 'http://localhost:5173',
    methods : ['GET' , 'POST'],
  },
});

const userRooms = new Map();

io.on('connection' , (socket) => {
  console.log(`Socket connected : ${socket.id}`);

  socket.on('join' , ({username , room}) => {
    socket.join(room);
    userRooms.set(socket.id , room);
    socket.to(room).emit('user_joined' , `${username} joined`);
  });

  socket.on('typing' , ({username}) => {
    const room = userRooms.get(socket.id);
    if(room){
      socket.to(room).emit('typing' , {username});
    }
  });

  socket.on('stop_typing' , ({username}) => {
    const room = userRooms.get(socket.id);
    if(room) {
      socket.to(room).emit('stop_typing' , {username});
    }
  });

  socket.on('disconnect' , () => {
    const room = userRooms.get(socket.id);
    if(room){
      socket.to(room).emit('user_left' , `Someone left`);
      userRooms.delete(socket.id);
    }
    console.log(`Socket disconnect : ${socket.id}`);
  })
});

server.listen(3000 , () => console.log("Server running on port 3000"));