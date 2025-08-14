const express = require('express');
const {Server} = require('socket.io');
const http = require('http');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'https://zingy-swan-d94a92.netlify.app',
            'http://localhost:5500'
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
