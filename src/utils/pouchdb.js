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
        console.log(projectName);
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
            callback(doc);
        }).catch(function (err) {
            console.log(err);
        });
    }
    
    /**
     * Not yet used in the project
     */
    deleteDoc(id) {
        this.db.get(this.project.projectData).then(function (doc) {
            console.log(doc);
            return this.db.remove(doc._id, doc._rev);
        }).then(function (result) {
            // handle result
            console.log(result);
        }).catch(function (err) {
            console.log(err);
        });
    }
}

PouchDB.dbContents = {};
PouchDB.projectData = {};
// new Date().toISOString()