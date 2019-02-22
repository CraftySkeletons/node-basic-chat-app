
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
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages-list').append(li);
});

// On newLocationMessage, creates 'li' to reference '<ol id="messages-list"></ol>' in the 'html' frontend and generates a link with coords in a new tab
socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Location<a/>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
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

// Emits 'createLocationMessage' when confirmed
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('- ALERT - Geolocation is not supported by current browser.. -');
    }

    // Assign the below properties and pass them to the server for referencing position
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        alert('- ALERT - Unable to acquire location.. -');
    });
});
