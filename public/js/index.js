
var socket = io();

// On connect
socket.on('connect', function () {
    console.log('- CONNECTED TO SERVER -');

    // Emit createMessage       -test-
    socket.emit('createMessage', {
        from: 'Skeletons',
        text: 'Hello text here'
    });
});

// On disconnect
socket.on('disconnect', function () {
    console.log('- DISCONNECTED FROM SERVER -');
});

// On newMessage        -test-
socket.on('newMessage', function (message) {
    console.log('- NEW MESSAGE -', message);
});