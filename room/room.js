var ProjectDoc = require('../universal/projectDoc');

var Room = function Room(data) {
    //console.log(data);
    //this.roomid = data._id;
    //this.projectName = data.projectName;
    //this.fileName = data.files[0].fileName;
    //this.fileContent = data.files[0].content;
    this.clients = [];
    this.project = new ProjectDoc();
    //this.projectData = projectDoc.setProjectDoc(
    //    data._id,
    //    data.projectName,
    //    data.files[0].content
    //);
    this.projectData = this.project.setProjectDoc(data._id, data.projectName, data);
};

Room.prototype.addClient = function(socketID) {
    this.clients.push(socketID);
};

//Room.prototype.setUpProject = function() {
//    this.projectData = {
//        _id: this.roomid,
//        projectName: this.projectName,
//        files: [
//            {
//               fileName: this.fileName,
//                content: this.fileContent
//            }
//        ],
//        public: false,
//        users: [
//            {
//                user: ''
//            }
//        ]
//    };
//};

module.exports = Room;