var Project = function() {};
/**
 *
 */
Project.prototype.setProjectDoc = function(id, projectName, htmlContent, jsContent, cssContent) {
    this.projectData = {
        _id: id,
        projectName: projectName,
        files: [
            {
                fileName: 'index.html',
                content: htmlContent
            },
            {
                fileName: 'script.js',
                content: jsContent
            },
            {
                fileName: 'style.css',
                content: cssContent
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

module.exports = Project;