"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});
let current_bid = { username: '', amount: 0 };
io.on('connection', (socket) => {
    console.log(`User connected : ${socket.id}`);
    socket.emit('current_bid', current_bid);
    socket.on('new_bid', (bid) => {
        if (bid.amount > current_bid.amount) {
            current_bid = bid;
            io.emit('bid_update', current_bid);
        }
        else {
            socket.emit('bid_rejected', {
                message: `Bid must be higher than ${current_bid.amount}`
            });
        }
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected :  ${socket.id}`);
    });
});
server.listen(3000, () => {
    'Server listening on port 3000';
});
