import pdb from 'pouchdb';
pdb.plugin(require('pouchdb-upsert'));
pdb.plugin(require('pouchdb-find'));

window.PouchDB = pdb; // allow extension in chrome dev tools to work

export default class PouchDB {

    constructor() {
        this.projectData = {};
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

    getDocs() {
        this.db.allDocs({
           include_docs: true
        }).then((result) => {
            this.dbContents = result;
            return result;
        }).catch((error) => {
            console.log(error);
        });
    }


}

PouchDB.dbContents = {};
PouchDB.projectData = {};
// new Date().toISOString()