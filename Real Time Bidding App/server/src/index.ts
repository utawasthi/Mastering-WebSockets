import express from 'express';
import http from 'http';
import cors from 'cors';
import {Server} from 'socket.io';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server , {
  cors : {
    origin : 'http://localhost:5173',
    methods : ['GET' , 'POST'],
  }
});

interface Bid {
  username : string; 
  amount : number;
}

let current_bid : Bid = {username : '' , amount : 0};


io.on('connection' , (socket) => {
  console.log(`User connected : ${socket.id}`);

  socket.emit('current_bid' , current_bid);

  socket.on('new_bid' , (bid : Bid) => {
    if(bid.amount > current_bid.amount){
      current_bid = bid;
      io.emit('bid_update' , current_bid);
    }
    else{
      socket.emit('bid_rejected' , {
        message : `Bid must be higher than ${current_bid.amount}`
      });
    }
  });

  socket.on('disconnect' , () => {
    console.log(`User disconnected :  ${socket.id}`);
  })
});


server.listen(3000 , () => {
  console.log('Server listening on port 3000');
});