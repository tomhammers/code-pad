var express = require('express');
var app = express();
var port = Number(process.env.PORT || 3000);
var server = app.listen(port);
var io = require('socket.io').listen(server);
var SetProject = require('./shared/setProject');

var PouchDB = require('pouchdb');
var db = new PouchDB('projects');
app.use('/db', require('express-pouchdb')(PouchDB));



var connections = [];
var rooms = [];

app.use(express.static('./public'));



io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: ' + socket.id + " sockets connected: " + connections.length);

    socket.on('sendProject', function (data) {
        //socket.broadcast.to(data.room).emit('checkmate', { url: URL });
        console.log(data.project.projectName + " received");
    });

    socket.on('joinRoom', function (data) {
        socket.join(data.id);
        console.log('Room ' + data.id + ' created');
    });

});


console.log('Server running on port 3000');
