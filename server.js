var express = require('express');
var app = express();
var port = Number(process.env.PORT || 3000);
var server = app.listen(port);
var io = require('socket.io').listen(server);

var connections = [];

app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

io.sockets.on('connection', function(socket) {

    connections.push(socket);
    console.log('Connected: ' + socket.id + " sockets connected: " + connections.length);

});


console.log('Server running on port 3000');