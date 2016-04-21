"use strict";
var express = require('express');
var app = express();

var server = require('http').createServer(app),
//var server = app.listen(port);
var io = require('socket.io').listen(server);

var path = require('path');
//var port = Number(process.env.PORT || 3000);

server.listen(process.env.PORT || 3000);

// handle all socket.io connections in this module
var Socket = require('./socket/handle-socket-events');
var socket = new Socket();

// handles routes
var pad = require('../routes/pad');

// tell express to set up the ejs view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// on a http request, serve users with all content in the public directory
app.use(express.static('./public'));

// handle request on different routes
app.use('/', pad);
app.use('/:room([A-Za-z0-9]{10})', pad);

// listen for a socket.io connection and pass it to the method in /socket/handle-socket-events.js
io.sockets.on('connection', socket.handleConnections);