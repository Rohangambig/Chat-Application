const express = require('express');
const {Server} = require('socket.io');
const http = require('http');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'https://poetic-pixie-5d7889.netlify.app/', // deployed frontend
            'http://127.0.0.1:5500' // local dev frontend
        ],
        methods: ['GET', 'POST']
    }
});



const userList = new Map();
const messageList = [];

io.on('connection',(socket) => {

    socket.on('newUser',(username) => {
        socket.username = username;
        userList.set(socket.id,username);
        io.emit('userList',Array.from(userList.values()));
    })

    socket.on('messageSend',(data) => {
        messageList.push({name:data.user,message:data.message});
        io.emit('messageList',Array.from(messageList));
    })

    socket.on('disconnect',() => {
        userList.delete(socket.id);
        io.emit('userList',Array.from(userList.values()));
    })

})

server.listen(5001,() => {
    console.log('Server is listening')
})
