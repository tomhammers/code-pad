var express = require('express');
var app = express();
var port = Number(process.env.PORT || 3000);
var server = app.listen(port);
var io = require('socket.io').listen(server);
var ProjectRoom = require('./room/room');

var PouchDB = require('pouchdb');
var db = new PouchDB('projects');
app.use('/db', require('express-pouchdb')(PouchDB));

// store all projects in an array, one for each room
var projects = [];
// grab this from the URL (on a unique URL visit
var projectID;
// store socket ids in here
var connections = [];
// an array of all room ids
var rooms = [];

app.use(express.static('./public'));

// handle requests with a unique URL
app.get('/:room([A-Za-z0-9]{10})', function (req, res) {
    // get roomID from URL on this route
    projectID = req.params.room;
    res.sendFile(__dirname + '/public/index.html');
});


io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log("Connected: " + connections.length + " sockets connected");

    socket.once('disconnect', function () {
        connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        console.log("Disconnected: " + connections.length + " sockets remaining");
    });

    socket.on('joinRoom', function (data) {
        // OPEN / unique URL, project exists on server
        if (data.id in rooms) {  // room exists
            console.log('block one');
            socket.join(data.id);
            rooms[data.id].addClient(socket);
            socket.emit('setupProject', {project: rooms[data.id].projectData});
        }
        // SAVE AS / OPEN, project does not exist on server (later - check DB too)
        // room does not exist, did the client send a project in the joinRoom request?
        else if (data.project !== null) { // project data exists, set up a new room
            console.log('block two');
            var room = new ProjectRoom(data.project);
            room.addClient(socket.id);
            rooms[data.id] = room; // add key value pair to array
            socket.join(data.id);
        }
        // unique URL but no matching key, project doesn't exist anywhere
        else { // at this stage there is not much we can do
            console.log('block three');
            // this could happen if project owner sets up project -> room, at a later date room no longer exists
            console.log("project doesn't exist on client or server");
            // later - make request to DB to look for project
        }
    });

    // code changed, pass to all sockets
    socket.on('codeChange', function (data) {
        // send to all clients other then sender
        socket.broadcast.to(data.id).emit('projectChange', data.project);
        // update project data in room
        rooms[data.id].projectData = data.project;
    });
});

console.log('Server running on port 3000');
