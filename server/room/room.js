var ProjectDoc = require('../../universal/projectDoc');

var Room = function Room(data) {
    this.clients = [];
    this.project = new ProjectDoc();
    this.projectData = this.project.setProjectDoc(data._id, data.projectName, data);
    this.cursorPosition = {};
    this.projectLocked = false;
    // user who has current write access
    this.socketEditing = '';
    this.timer = null;
};

Room.prototype.addClient = function(socketID) {
    this.clients.push(socketID);
};


module.exports = Room;