import PouchDB from 'pouchdb';
import ProjectDoc from '../../universal/projectDoc';
PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(require('pouchdb-find'));

window.PouchDB = PouchDB; // allow extension in chrome dev tools to work

export default class Pouch {

    constructor() {
        this.project = new ProjectDoc();
        this.projectData = {};
        this.selectedProject = {};
    }

    createDB(dbName) {
        this.db = new PouchDB(dbName);
    }

    setupProjectDoc(id, projectName, files) {
        this.projectData = this.project.setProjectDoc(id, projectName, files);
        return this.projectData;
    }

    upsertDoc() {
        this.db.upsert(this.project.projectData._id, (doc) => {
            return this.project.projectData;
        });
    }

    getDocs(callback) {
        this.db.allDocs({
           include_docs: true
        }).then((result) => {
            this.dbContents = result;
            callback();
        }).catch((error) => {
            console.log(error);
        });
    }

    findSingleDoc(id, callback) {
        this.db.get(id).then(function (doc) {
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