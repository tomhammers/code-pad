"use strict";
var express = require('express');
var app = express();
var router = express.Router();

app.use("/", router);

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var path = require('path');

server.listen(process.env.PORT || 3000);

// handle all socket.io connections in this module
var Socket = require('./socket/handle-socket-events');
var socket = new Socket();

app.set('view engine', 'ejs');

// handles routes
// var pad = require('./routes/pad');

// on a http request, serve users with all content in the public directory
app.use(express.static('./public'));

// handle request on different routes
// app.use('/', pad);
// app.use('/:room([A-Za-z0-9]{10})', pad);

// app.use('/pad', pad);
// app.use('/pad/:room([A-Za-z0-9]{10})', pad);

app.get('/', function(req, res, next) {
  res.render('pad');
});

app.get('/:room([A-Za-z0-9]{10})', function(req, res, next) {
  res.render('pad');
});

app.get('/pad', function(req, res, next) {
  res.render('pad');
});

app.get('/pad/:id', function(req, res, next) {
  res.render('pad');
});

// listen for a socket.io connection and pass it to the method in /socket/handle-socket-events.js
io.sockets.on('connection', socket.handleConnections);