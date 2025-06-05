import express from 'express';
import http from 'http';
import cors from 'cors';
import {Server , Socket} from 'socket.io';
import connectToDB from './db/db';


const app  = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server , {
  cors : {
    origin : "http://localhost:5173",
    methods : ["GET" , "POST"],
  }
});

connectToDB();

let users = 0;

// all interfaces --> 


// Extend socket to hold username
interface CustomSocket extends Socket {
  username?: string;
}

interface MsgData {
  message : string;
}

io.on('connection' , (socket : CustomSocket) => {
  users++;
  console.log('User connected : ' , socket.id);
  io.emit('users_count' , users);

  socket.on('join' , (username : string) => {
    socket.username = username;
    socket.broadcast.emit('chat_message' , {
      message : `${username} joined` , 
      sender : 'Server'});
  });

  socket.on('send_message' , (msgData : MsgData) => {
    io.emit('chat_message' , {
      message : msgData.message,
      sender : socket.username,
    }); // broadcast to all 
  });

  socket.on('disconnect' , () => {
    users--;
    io.emit('users_count' , users);
    if (socket.username) {
      socket.broadcast.emit('chat_message', { 
        message: `${socket.username} left`, 
        sender: 'Server'});
    }
    console.log('User Disconnected' , socket.id);
  });
});


server.listen(3001 , () => {
  console.log("Server is running on port 3001");
});