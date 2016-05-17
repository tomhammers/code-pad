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
    /**
     * uses same module as backend to set up project document
     */
    setupProjectDoc(id, projectName, files) {
        this.projectData = this.project.setProjectDoc(id, projectName, files);
        return this.projectData;
    }
    /**
     * handy method that either creates new doc or updates existing one
     */
    upsertDoc() {
        this.db.upsert(this.project.projectData._id, (doc) => {
            return this.project.projectData;
        });
    }
    /**
     * file-> open // get latest docs from local db
     */
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
    /**
     * user has chosen a project to open
     */
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