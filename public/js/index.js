
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
    var formattedTime = moment(message.createdAt).format('( ddd h:mm a )');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages-list').append(html);
});

// On newLocationMessage, creates 'li' to reference '<ol id="messages-list"></ol>' in the 'html' frontend and generates a link with coords in a new tab
socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('( ddd h:mm a )');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    jQuery('#messages-list').append(html);
});

// Emits 'createMessage' when text is submitted             ( 'createMessage' -> 'newMessage'  -> 'generateMessage' )
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    // Represents the input value of the input form text
    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User:',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});

// Emits 'createLocationMessage' when confirmed
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('- ALERT - Geolocation is not supported by current browser.. -');
    }

    // Defines new 'disabled' attribute in reference to html 'button' and assigns the variable to 'disabled' respectively to prevent input
    locationButton.attr('disabled', 'disabled').text('Emitting Location..');

    // Assign the below properties and pass them to the server for referencing position
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Enable / Disable ( Coordinates )');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        // Remove the 'disabled' state of the html 'button' allowing input
        locationButton.removeAttr('disabled').text('Enable / Disable ( Coordinates )');
        alert('- ALERT - Unable to acquire location.. -');
    });
});
