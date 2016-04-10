var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// setting up diffsync's DataAdapter
var diffsync    = require('diffsync');
var dataAdapter = new diffsync.InMemoryDataAdapter();

// setting up the diffsync server
var diffSyncServer = new diffsync.Server(dataAdapter, io);

app.use(express.static('./public'));

// starting the http server
http.listen(3000, function(){
    console.log('ready to go');
});