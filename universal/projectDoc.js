var Project = function(files) {
    this.files = [];
    //this.loadFiles(files);
};

/**
 * Method to setup the project doc, used both on the client and sever side to ensure
 * its always consistent
 * @param id
 * @param projectName
 * @param files
 */
Project.prototype.setProjectDoc = function(id, projectName, files) {
    console.log(files);
    this.projectData = {
        _id: id,
        projectName: projectName,
        files: files.files,
        public: false,
        users: [
            {
                user: ''
            }
        ]
    };
};


module.exports = Project;