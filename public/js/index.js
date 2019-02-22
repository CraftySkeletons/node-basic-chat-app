
var socket = io();

// On connect
socket.on('connect', function () {
    console.log('- CONNECTED TO SERVER -');
});

// On disconnect
socket.on('disconnect', function () {
    console.log('- DISCONNECTED FROM SERVER -');
});

// On newMessage, creates 'li' to reference '<ol id="messages-list"></ol>' in the 'html' frontend and assigns submitted form values to be rendered
socket.on('newMessage', function (message) {
    console.log('- NEW MESSAGE -', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages-list').append(li);
});

// Emits 'createMessage' when text is submitted             ( 'createMessage' -> 'generateMessage' -> 'newMessage' )
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        console.log('- message submitted to server -');
    });
});
