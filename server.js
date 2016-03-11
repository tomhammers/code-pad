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

    socket.once('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        console.log("Disconnected: " + connections.length + " sockets remaining");
    });

    console.log("Connected: " + connections.length + " sockets connected");
    // room exists! let socket join room(this happens on unique URL)
    if (rooms.indexOf(projectID) !== -1) {
        socket.join(projectID);
        //console.log(Object.keys(socket.adapter.rooms[projectID]).length + " users in room " + projectID);
        // using the id, find correct project object in array (projectData._id)
        var projectsLength = projects.length;
        for (var i=0; i< projectsLength; i++) {
            if (projects[i]._id === projectID) {
                socket.emit('setupProject', { project: projects[i] });
            }
        }
    }
    // this happens after initial save on a new project
    socket.on('joinRoom', function(data) {
        // initialise the room and project for the room
        var room = new ProjectRoom(data);
        rooms.push(room.roomid);
        projects.push(room.projectData);
        socket.join(room.roomid);
        console.log('Room ' + room.roomid + ' created');
    });
    // code changed, pass to all sockets
    socket.on('codeChange', function(data) {
        socket.broadcast.to(data.project._id).emit('projectChange', data);
        var projectsLength = projects.length;
        for (var i=0; i< projectsLength; i++) {
            if (projects[i]._id === data.project._id) {
                //socket.emit('setupProject', { project: projects[i] });
                projects[i] = data.project;
            }
        }
        console.log(projects[0]);
    });
});

console.log('Server running on port 3000');
