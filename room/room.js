var Room = function Room(data) {
    this.roomid = data.project._id;
    this.projectName = data.project.projectName;
    this.fileName = data.project.files[0].fileName;
    this.fileContent = data.project.files[0].content;
    this.clients = [];
    this.projectData = {};

    this.setUpProject();
};

Room.prototype.addClient = function(socketID) {
    this.clients.push(socketID);
};

Room.prototype.setUpProject = function() {
    this.projectData = {
        _id: this.roomid,
        projectName: this.projectName,
        files: [
            {
               fileName: this.fileName,
                content: this.fileContent
            }
        ],
        public: false,
        users: [
            {
                user: ''
            }
        ]
    };
};

module.exports = Room;