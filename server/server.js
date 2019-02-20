
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// On connection
io.on('connection', (socket) => {
    console.log('- New user connection -');

    // Emit newMessage          -test-
    socket.emit('newMessage', {
        from: 'Mr Bones',
        text: 'Hey there',
        createdAt: 123456
    });

    // On createMessage         -test-
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
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
