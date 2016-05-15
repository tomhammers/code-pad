var Project = function() {
    this.files = [];
};

/**
 * Method to setup the project doc, used both on the client and sever side to ensure
 * its always consistent
 * @param id
 * @param projectName
 * @param files
 */
Project.prototype.setProjectDoc = function(id, projectName, files) {
    this.projectData = {
        _id: id,
        projectName: projectName,
        files: files,
        public: true,
        users: [
            {
                user: ''
            }
        ],
        activeFile: 'index.html',
        cursorPos: {row: 0, column: 0}
    };
};


module.exports = Project;
