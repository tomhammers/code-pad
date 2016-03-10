module.exports = function (id, filename, content, projectName) {
    var projectData = {
        _id: id,
        projectName: projectName,
        files: [
            {
                fileName: filename,
                content: content
            }
        ],
        public: false,
        users: [
            {
                user: ''
            }
        ]
    };

    return projectData;
};
