import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row } from 'react-bootstrap';
import { Link } from  'react-router';
import io from 'socket.io-client';
import Pouch from '../pouch/pouchdb';

import Header from './../components/header';
import LeftSidebar from './../components/left-sidebar';
import Pad from './../components/pad';
import Preview from './../components/preview';
import SaveModal from './../components/save-modal';
import OpenModal from './../components/open-modal';

const socket = io();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.pdb = new Pouch();
        // create local DB if one doesn't exist (couch ignores otherwise)
        this.pdb.createDB('projects');

        this.initialCode = "<html>\n    <body>\n        \n    </body>\n</html>";
        this.projects = [];

        this.state = {
            title: 'Code-Pad',
            projectName: '',
            code: this.initialCode,
            showSaveModal: false,
            showOpenModal: false,
            projectsFromDB: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.createNewDoc = this.createNewDoc.bind(this);
        this.newProject = this.newProject.bind(this);
        this.openProject = this.openProject.bind(this);
        this.viewProjects = this.viewProjects.bind(this);
        this.storeProjects = this.storeProjects.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.loadProject = this.loadProject.bind(this);
        this.setupProject = this.setupProject.bind(this);
        this.projectChange = this.projectChange.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.connect = this.connect.bind(this);
    }

    componentWillMount() {
        var url = window.location.href;
        this.uniqueID = url.split("/").pop();
        socket.on('connect', this.connect);
        socket.on('disconnect', this.disconnect);
        socket.on('setupProject', this.setupProject);
        socket.on('projectChange', this.projectChange);
    }


    generateUniqueID(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * 62));
        }
        return id;
    }

    connect() {
        console.log('Connected! ' + socket.id);
        if (this.uniqueID !== '') {
            // if ID in URL is not empty, attempt to connect to room on server
            this.joinRoom(this.uniqueID, null);
        }
    }

    disconnect() {
    }

    /**
     * Sends request to sever to join or create a socket.io room for project
     * @param id
     * @param project
     */
    joinRoom(id, project) {
        socket.emit('joinRoom', {
            id: id,
            project: project
        });
    }

    /**
     * Handle response from socket.io server, sets the editor up with latest project from server
     * @param data
     */
    setupProject(data) {
        this.uniqueID = data.project._id;
        this.setState({ code: data.project.files[0].content, projectName: data.project.projectName});
        // put a copy of project in client's db
        this.pdb.projectData = data.project;
        this.pdb.upsertDoc();
    }

    projectChange(data) {
        this.setState({ code: data.files[0].content});
    }

    closeModal() {
        this.setState({showOpenModal: false});
    }

    handleChange(stateToChange, value) {
        switch (stateToChange) {
            case 'code':
                this.setState({code: value});

                if (this.state.projectName !== '') {
                    // store project in local db
                    this.pdb.setProjectDoc(this.uniqueID, 'index.html', this.state.code, this.state.projectName);
                    // emit to server
                    socket.emit('codeChange', {id: this.uniqueID, project: this.pdb.projectData});
                    // should save existing document
                    this.pdb.upsertDoc();
                }
                break;
            case 'saveAsInput':
                this.setState({projectName: value});
                break;
        }
    }

    // this is 'Save As', or what happens when user first saves the project
    createNewDoc() {
        this.uniqueID = this.generateUniqueID(10);
        this.pdb.setProjectDoc(this.uniqueID, 'index.html', this.state.code, this.state.projectName);

        this.pdb.upsertDoc();
        this.setState({showSaveModal: false});
        // create a socket.io room on the server for this project
        //socket.emit('joinRoom', {
        //    id: this.uniqueID,
        //    project: this.pdb.projectData
        //});
        this.joinRoom(this.uniqueID, this.pdb.projectData);
        // change the URL, this is now the project's URL
        history.pushState({"id": 1}, "", this.uniqueID);
    }

    // normal save, if project is not defined then it shows the user a 'Save As' Modal
    handleSave() {
        // should set or update data before putting to DB
        this.pdb.setProjectDoc(this.uniqueID, 'index.html', this.state.code, this.state.projectName);

        if (this.state.projectName !== '') {
            // should save existing document
            this.pdb.upsertDoc();
        } else {
            // else show modal so user can name the project
            this.setState({showSaveModal: true});
        }
    }

    // reset everything
    newProject() {
        this.setState({projectName: '', code: this.initialCode});
        // need a new ID now
        this.uniqueID = this.generateUniqueID(10);
    }

    // note callback is passed which is called once the operation has finished
    viewProjects() {
        this.pdb.getDocs(this.storeProjects);
    }

    // this is called once pouch has retrieved docs from the DB, store all project names locally
    storeProjects() {
        for (let row of this.pdb.dbContents.rows) {
            this.projects.push(row.doc);
        }

        this.setState({
            projectsFromDB: this.projects,
            showOpenModal: true
        });
    }

    openProject(projectID) {
        // find project in db using ID, and pass a callback to handle the response
        this.pdb.findSingleDoc(projectID, this.loadProject);
    }
    // file->open
    loadProject(proj) {
        // proj is response from pouchdb, set up project in editor
        this.uniqueID = proj._id;
        // setting state will force a render
        this.setState({
            projectName: proj.projectName,
            code: proj.files[0].content,
            showOpenModal: false
        });
        // change URL to match project ID
        history.pushState({"id": 1}, "", this.uniqueID);
        // now join / create a socket.io room
        //socket.emit('joinRoom', {
        //    id: this.uniqueID,
        //    project: proj
        //});
        console.log(proj);
        this.joinRoom(this.uniqueID, proj);
    }

    render() {
        return (
            <Grid fluid>
                <Header
                    className="header"
                    title={this.state.title}
                    onSave={this.handleSave}
                    onNew={this.newProject}
                    onOpen={this.viewProjects}
                />

                <Row>
                    <LeftSidebar
                    />

                    <Pad
                        onChange={this.handleChange}
                        code={this.state.code}
                    />

                    <Preview
                        code={this.state.code}
                    />
                </Row>

                <SaveModal
                    modalTitle='Save'
                    onChange={this.handleChange}
                    show={this.state.showSaveModal}
                    inputValue={this.state.projectName}
                    buttonTitle='Save'
                    buttonClick={ this.createNewDoc }
                />

                <OpenModal
                    modalTitle='Open Project'
                    show={this.state.showOpenModal}
                    buttonTitle='Close'
                    projects={this.state.projectsFromDB}
                    buttonClick={ this.closeModal }
                    selectProject={ this.openProject }
                />

            </Grid>


        );
    }
}