"use strict";
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});
let users = 0;
io.on('connection', (socket) => {
    users++;
    console.log('User connected : ', socket.id);
    io.emit('users_count', users);
    socket.on('join', (username) => {
        socket.username = username;
        name = username;
        socket.broadcast.emit('chat_message', { message: `${username} joined`, sender: 'Server' });
    });
    socket.on('send_message', (msgData) => {
        io.emit('chat_message', {
            message: msgData.message,
            sender: socket.username,
        }); // broadcast to all 
    });
    socket.on('disconnect', () => {
        users--;
        io.emit('users_count', users);
        if (socket.username) {
            socket.broadcast.emit('chat_message', { message: `${socket.username} left`, sender: 'Server' });
        }
        console.log('User Disconnected', socket.id);
    });
});
server.listen(3001, () => {
    console.log("Server is running on port 3001");
});
