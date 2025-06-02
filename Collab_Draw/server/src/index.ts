import express from 'express';
import http from 'http';
import cors from 'cors';
import {Server} from 'socket.io';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server (server , {
  cors : {
    origin : 'http://localhost:5173',
    methods : ['GET' , 'POST'],
  }
});

io.on('connection' , (socket) => {
  console.log(`User connected : ${socket.id}`);

  socket.on('draw' , (data) => {
    socket.broadcast.emit('draw' , data);
  });

  socket.on('disconnect' , () => {
    console.log(`User disconnected : ${socket.id}`);
  });
});


server.listen(3000 , () => {
  console.log('Server listening on Port 3000');
});