var ProjectRoom = require('./room');
var Cloudant = require('../cloudant-crud');
var cloudant = new Cloudant();

// store all projects in an array, one for each room
var projects = [];
// store socket ids in here
var connections = [];
// an array of all room ids
var rooms = [];

var messages = [];

var Socket = function Socket() { }

// var upsertProject = function (id, project) {
//     pdb.upsert(id, (doc) => {
//         return project;
//     });
// }

// var findProject = function (id, callback) {
//     pdb.get(id).then(function (doc) {
//         callback(doc);
//     }).catch(function (err) {
//         console.log(err);
//     });
// }

// var getDocs = function (callback) {
//     pdb.allDocs({
//         include_docs: true
//     }).then((result) => {
//         callback(result);
//     }).catch((error) => {
//         console.log(error);
//     });
// }

/**
 * Handles events made by each individual socket
 */
Socket.prototype.handleConnections = function (socket) {
    connections.push(socket);
    console.log("Connected: " + connections.length + " sockets connected");

    socket.once('disconnect', function () {
        connections.splice(connections.indexOf(socket), 1);
        socket.disconnect();
        console.log("Disconnected: " + connections.length + " sockets remaining");
    });

    socket.on('joinRoom', function (data) {
        var clientsInRoom = [];

        // OPEN / unique URL / user goes offline -> online. Project exists on server
        if (data.id in rooms) {  // room key exists, therefore project data exists on server
            socket.join(data.id);
            rooms[data.id].addClient(socket.id);
            // send client project data
            socket.emit('setupProject', { project: rooms[data.id].project });
            socket.emit('inRoom');
            socket.emit('chatInfo', { users: rooms[data.id].clients, msgs: messages });
            socket.broadcast.to(data.id).emit('chatInfo', { users: rooms[data.id].clients, msgs: messages });
        }
        // SAVE AS / OPEN, project does not exist on server, but client sent a project
        // room does not exist, did the client send a project in the joinRoom request?
        else if (data.project !== null) { // project data was sent by client, set up a new room
            var room = new ProjectRoom(data.id, data.project);
            // upload the project to cloudant
            cloudant.insertProject(data.project, data.id);
            room.addClient(socket.id);
            rooms[data.id] = room; // add key value pair to array
            socket.join(data.id); // let the client join the project's room
            socket.emit('inRoom');
        }
        // unique URL but no matching key, have a look in cloudant
        else {
            cloudant.findProject(data.id, handleResponse);
            function handleResponse(doc) {
                if (doc !== undefined) {
                    var room = new ProjectRoom(data.id, doc);
                    room.addClient(socket.id);
                    rooms[data.id] = room; // add key value pair to array
                    socket.join(data.id);
                    socket.emit('inRoom');
                    socket.emit('setupProject', { project: rooms[data.id].project });
                }
            }
        }
    });

    // a client emitted a code change
    socket.on('codeChange', function (data) {
        // if project is open
        if (rooms[data.id].projectLocked === false) {
            cloudant.updateProject(data.project, data.id);
            // upsertProject(data.id, data.project);
            // lock the project to the current socket
            rooms[data.id].projectLocked = true;
            rooms[data.id].socketEditing = socket.id;
            rooms[data.id].cursorPosition = data.cursorPos;
            // todo: send message to lock other clients pads
            // send changes to all clients other then sender
            console.log(data.cursorPos);
            socket.broadcast.to(data.id).emit('projectChange', { code: data.project, cursorPos: data.cursorPos, activeFile: data.activeFile });
            // update project data in room
            rooms[data.id].project.projectData = data.project;
            rooms[data.id].timer = setTimeout(function () {
                rooms[data.id].projectLocked = false;
                rooms[data.id].socketEditing = '';
            }, 5000);
        }
        // if project is locked, socket attempting edit must match one with write access
        else if (rooms[data.id].projectLocked && rooms[data.id].socketEditing === socket.id) {
            console.log("here")
            cloudant.updateProject(data.project, data.id);
            // upsertProject(data.id, data.project);
            // send changes to all clients other then sender
            console.log(data.cursorPos);
            socket.broadcast.to(data.id).emit('projectChange', { code: data.project, cursorPos: data.cursorPos, activeFile: data.activeFile });
            // update project data in room
            rooms[data.id].project.projectData = data.project;

            clearTimeout(rooms[data.id].timer);
            rooms[data.id].timer = setTimeout(function () {
                rooms[data.id].projectLocked = false;
                rooms[data.id].socketEditing = '';
            }, 5000);
        }
        // reject any other scenario and push the current server project to the user
        else {
            // reject change and clear their attempted edit to the document
            socket.emit('projectChange', { code: rooms[data.id].project.projectData, cursorPos: data.cursorPos, activeFile: data.activeFile });
        }
    });

    // when a user comes back online, send the servers latest project
    socket.on('requestLatestProject', function (data) {
        socket.emit('latestProject', { project: rooms[data.id].project.projectData });
    });

    socket.on('requestProjects', function (data) {
        //getDocs(emitServerProjects);
        cloudant.getAllProjects(emitServerProjects);
        function emitServerProjects(projects) {
            socket.emit('serverProjects', { projects: projects });
        }
    });
    // 
    socket.on('leave room', function () {
        console.log("Client leaving room: " + data.id)
        socket.leave(data.id);
    });

    socket.on('chat msg', function (data) {
        var msg = { user: socket.id, message: data.msg };
        messages.push(msg);
        socket.broadcast.to(data.id).emit('new msg', { msg: msg });
        socket.emit('new msg', { msg: msg });
    });
}

module.exports = Socket;