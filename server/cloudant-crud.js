var Cloudant = require('cloudant');
var Credentials = require('../config');
var cloudant = Cloudant({ account: process.env.CLOUDANT_USER, password: process.env.CLOUDANT_PASS });
var projectsdb = cloudant.db.use('projects')

var Cloudant = function Cloudant() {
}

Cloudant.prototype.findProject = function (id, callback) {
    projectsdb.get(id, function (err, data) {
        callback(data);
    });
}

/**
 * READ
 */
Cloudant.prototype.getAllProjects = function (callback) {
    var projects = [];
    projectsdb.list({ include_docs: true }, function (err, body) {
        callback(body.rows);
    })
}

/**
 * CREATE
 */
Cloudant.prototype.insertProject = function (project, id) {
    projectsdb.insert(project, id, function (err, body, header) {
        if (err) {
            console.log(err);
        }
        console.log("Project " + id + " successfully uploaded");
    })
}
/**
 * UPDATE existing project
 */
Cloudant.prototype.updateProject = function (project, id) {
    projectsdb.get(id, function (err, doc) {
        console.log(doc);
        var updaterev = doc._rev;
        projectsdb.insert({
            _rev: updaterev,
            projectName: project.projectName,
            files: project.files,
            public: project.public,
            activeFile: project.activeFile,
            cursorPos: project.cursorPos
        },id, function(err, body, header) {
            if (!err)
            {
                console.log("project updated on database");
            }
            else
            {
                console.log(err.error);
            }
        });
    });
}

module.exports = Cloudant;