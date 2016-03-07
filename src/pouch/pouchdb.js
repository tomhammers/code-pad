import pdb from 'pouchdb';
pdb.plugin(require('pouchdb-upsert'));
pdb.plugin(require('pouchdb-find'));

window.PouchDB = pdb; // allow extension in chrome dev tools to work

export default class PouchDB {

    constructor() {
        this.projectData = {};
        this.selectedProject = {};
    }

    createDB(dbName) {
        this.db = new pdb(dbName);
        let remoteCouch = false;
    }

    setProjectDoc(id, filename, content, projectName) {
        this.projectData = {
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
    }

    upsertDoc() {
        console.log(this.db);
        this.db.upsert(this.projectData._id, (doc) => {
            return this.projectData;
        });
    }

    getDocs(callback) {
        this.db.allDocs({
           include_docs: true
        }).then((result) => {
            this.dbContents = result;
            callback();
            //return;
        }).catch((error) => {
            console.log(error);
        });
    }

    findSingleDoc(id, callback) {
        this.db.get(id).then(function (doc) {
            //console.log(doc);
            //this.selectedProject = doc;
            callback(doc);
        }).catch(function (err) {
            console.log(err);
        });
    }


}

PouchDB.dbContents = {};
PouchDB.projectData = {};
// new Date().toISOString()