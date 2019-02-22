
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// On connection
io.on('connection', (socket) => {
    console.log('- New user connection -');

    // Emit for all users, using 'generateMessage'
    socket.emit('newMessage', generateMessage('Admin', '- welcome to the application -'));

    // Emit for all other users
    socket.broadcast.emit('newMessage', generateMessage('Admin', '- a new user has connected -'));

    // On createMessage, Listen for incoming 'createMessage' emit, then broadcast to all users w/ 'socket.broadcast.emit(newMessage, {})'
    // using former injected attributes from 'createMessage' etc.
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    // On disconnect
    socket.on('disconnect', () => {
        console.log('- User has disconnected from server... -')
    });
});

// Start server on appropriate port
server.listen(port, () => {
    console.log(`- Server running on ${port}... -`);
});
