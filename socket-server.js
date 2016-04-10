"use strict";
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
        // OPEN / unique URL / user goes offline -> online, project exists on server
        if (data.id in rooms) {  // room key exists, therefore project data exists on server too
            //console.log('block one');
            socket.join(data.id);
            rooms[data.id].addClient(socket);
            // send client project data
            socket.emit('setupProject', {project: rooms[data.id].project});
            socket.emit('inRoom');
        }
        // SAVE AS / OPEN, project does not exist on server (later - check DB too)
        // room does not exist, did the client send a project in the joinRoom request?
        else if (data.project !== null) { // project data was sent by client, set up a new room
            //console.log('block two');
            var room = new ProjectRoom(data.project);
            room.addClient(socket.id);
            rooms[data.id] = room; // add key value pair to array
            socket.join(data.id);
            socket.emit('inRoom');
        }
        // unique URL but no matching key, project doesn't exist anywhere
        else { // at this stage there is not much we can do
            //console.log('block three');
            // this could happen if project owner sets up project -> room, at a later date room no longer exists
            //console.log("project doesn't exist on client or server");
            // later - make request to DB to look for project
        }
    });

    // a client emitted a code change
    socket.on('codeChange', function (data) {
        // if project is open
        if (rooms[data.id].projectLocked === false) {
            // lock the project to the current socket
            rooms[data.id].projectLocked = true;
            rooms[data.id].socketEditing = socket.id;
            rooms[data.id].cursorPosition = data.cursorPos;
            // todo: send message to lock other clients pads
            // send changes to all clients other then sender
            socket.broadcast.to(data.id).emit('projectChange', {code: data.project, cursorPos: data.cursorPos, activeFile: data.activeFile});
            // update project data in room
            rooms[data.id].project.projectData = data.project;
            rooms[data.id].timer = setTimeout(function() {
                rooms[data.id].projectLocked = false;
                rooms[data.id].socketEditing = '';
            }, 5000);
        }
        // if project is locked, socket attempting edit must match one with write access
        if (rooms[data.id].projectLocked && rooms[data.id].socketEditing === socket.id) {
            // send changes to all clients other then sender
            socket.broadcast.to(data.id).emit('projectChange', {code: data.project, cursorPos: data.cursorPos, activeFile: data.activeFile});
            // update project data in room
            rooms[data.id].project.projectData = data.project;

            clearTimeout(rooms[data.id].timer);
            rooms[data.id].timer = setTimeout(function() {
                rooms[data.id].projectLocked = false;
                rooms[data.id].socketEditing = '';
            }, 5000);
        }
        // only other scenario should be socket attempting edit not matching one with write access
        if (rooms[data.id].projectLocked && rooms[data.id].socketEditing !== socket.id) {
            // reject change and clear their attempted edit to the document
            console.log(socket.id + " does not have write access");
            socket.emit('projectChange', {code: rooms[data.id].project.projectData, cursorPos: data.cursorPos, activeFile: data.activeFile});
        }
    });

    // when a user comes back online, send the servers latest project
    socket.on('requestLatestProject', function(data) {
        socket.emit('latestProject', {project: rooms[data.id].project});
    });
});

