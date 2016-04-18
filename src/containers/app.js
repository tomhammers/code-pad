import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import io from 'socket.io-client';
import Pouch from '../pouch/pouchdb';
import Parser from '../parser/project-parser.js';
// react components that will be rendered
import Header from './../components/header';
import FileTabs from './../components/file-tabs';
import Pad from './../components/pad';
import Hub from './../components/hub';
import Preview from './../components/preview';
import SaveModal from './../components/save-modal';
import OpenModal from './../components/open-modal';
import DiffModal from './../components/diff-modal';

import InitialContent from './initialContent.json';
import Libraries from './../components/libraries.json';

const socket = io();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.pdb = new Pouch();
        this.parser = new Parser();
        // create local DB if one doesn't exist (couch ignores otherwise)
        this.pdb.createDB('projects');
        // attempt to get uniqueID from URL
        this.uniqueID = window.location.href.split("/").pop();
        // if didn't find one set a new one
        if (this.uniqueID === '') {
            this.uniqueID = this.generateUniqueID(10);
        }
        // set the project up with default values
        this.pdb.setupProjectDoc(this.uniqueID, '', InitialContent);
        this.projects = [];
        // setting initial state for the first React render()
        this.state = {
            projectName: '',
            pageHeight: 0,
            code: this.pdb.project.projectData,
            serverCode: { files: [{ content: "" }] },
            cursorPos: { row: 0, column: 0 },
            showSaveModal: false,
            showOpenModal: false,
            showDiffModal: false,
            projectsFromDB: [],
            activeFile: 'index.html',
            status: 'disconnected',
            offlineMode: true
        };
        // wish there was a better way, need to bind this to every method to keep it in context
        this.handlePadChange = this.handlePadChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.createNewDoc = this.createNewDoc.bind(this);
        this.newProject = this.newProject.bind(this);
        this.openProject = this.openProject.bind(this);
        this.storeProjects = this.storeProjects.bind(this);
        this.loadProject = this.loadProject.bind(this);
        this.setupProject = this.setupProject.bind(this);
        this.projectChange = this.projectChange.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.selectFile = this.selectFile.bind(this);
        this.goOnline = this.goOnline.bind(this);
        this.compareProjects = this.compareProjects.bind(this);
        this.patchServerCode = this.patchServerCode.bind(this);
        this.pushToServer = this.pushToServer.bind(this);
        this.forkProject = this.forkProject.bind(this);
        this.insertLibrary = this.insertLibrary.bind(this);
        this.emitCodeChange = this.emitCodeChange.bind(this);
    }
    /**
     * React cycle, before the DOM is rendered
     */
    componentWillMount() {
        // listen for server events and call the corrosponding method
        socket.on('connect', () => { if (this.uniqueID !== '') this.joinRoom(this.uniqueID, null) });
        socket.on('disconnect', () => { this.setState({ status: 'disconnected' }) });
        socket.on('setupProject', this.setupProject);
        socket.on('projectChange', this.projectChange);
        socket.on('inRoom', () => { this.setState({ status: 'connected', offlineMode: false}) });
        socket.on('latestProject', this.compareProjects);
    }
    /**
     * React cycle, after the DOM is rendered
     */
    componentDidMount() {
        // get the window height - header height
        let fullPageHeight = document.getElementById('app').offsetHeight;
        let headerHeight = document.getElementsByClassName('navbar')[0].offsetHeight;
        this.setState({ pageHeight: fullPageHeight - headerHeight });
    }
    /**
     * generate a uniqueID for each project
     * @param length
     * @returns {string}
     */
    generateUniqueID(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * 62));
        }
        return id;
    }
    /**
     * When user goes online, either checks for existing project or set a new one up
     */
    goOnline() {
        // request latest project from the server
        if (this.state.projectName !== '') {
            socket.emit('requestLatestProject', { id: this.uniqueID });
        } else {
            this.handleSave();
        }
    }
    /**
     * Sends request to sever to join or create a socket.io room for project, optionally send project
     * @param id
     * @param project
     */
    joinRoom(id, project) {
        socket.emit('joinRoom', { id: id, project: project });
    }
    /**
     * Opens Modal so user can view differences between projects
     * @param data
     */
    compareProjects(data) {
        this.setState({
            serverCode: data.project
        }, function () {
            // only open if project is different to server's copy
            if (!(_.isEqual(this.state.code.files, this.state.serverCode.files))) {
                this.setState({ showDiffModal: true });
            } else {
                // if project is the same, just put the user online
                this.setState({ offlineMode: false, status: 'connected' });
            }
        });
    }
    /**
     * Handle response from socket.io server when joining existing project
     * @param data
     */
    setupProject(data) {
        // setting up data response from server
        this.uniqueID = data.project.projectData._id;
        this.setState({ code: data.project.projectData, projectName: data.project.projectData.projectName });
        // put a copy of project in client's db for offline use
        this.pdb.project.projectData = data.project.projectData;
        this.pdb.upsertDoc();
    }
    /**
     * On messages from socket.io, setting the state will cause React to re-render
     * @param data
     */
    projectChange(data) {
        if (!this.state.offlineMode) {
            this.setState({
                code: data.code,
                cursorPos: data.cursorPos,
                activeFile: data.activeFile
            });
        }
    }
    /**
     * Whenever a user changes something in a pad
     * @param pads
     * @param cursorPos
     */
    handlePadChange(pads, cursorPos) {
        // loop through all pads and get their value, update the projectDoc
        for (let i = 0, l = pads.length; i < l; i++) {
            this.pdb.project.projectData.files[i].content = pads[i].getSession().getValue();
        }
        // setState will cause React to re render all components
        this.setState({ code: this.pdb.project.projectData, cursorPos: cursorPos });
        // if project was previously saved
        if (this.state.projectName !== '') {
            // emit to server, if in online mode
            if (!this.state.offlineMode) {
                this.emitCodeChange();
            }
            //  save existing project in local db
            this.pdb.upsertDoc();
        }
    }
    /**
     * Send code change to server
     */
    emitCodeChange() {
        socket.emit('codeChange', {
            id: this.uniqueID,
            project: this.pdb.project.projectData,
            cursorPos: this.state.cursorPos,
            activeFile: this.state.activeFile
        });
    }
    /**
     * this is 'Save As', or what happens when user first saves the project and gives the project a name
     */
    createNewDoc() {
        this.pdb.setupProjectDoc(this.uniqueID, this.state.projectName, this.state.code);
        this.pdb.upsertDoc();
        // create a socket.io room on the server for this project
        this.joinRoom(this.uniqueID, this.pdb.project.projectData);
        // change the URL, this is now the project's unique URL(first 2 values dummy data)
        history.pushState({ "id": 1 }, "", this.uniqueID);
        this.setState({ showSaveModal: false, offlineMode: false });
    }
    /**
     * normal save, if project is not defined then it shows the user a 'Save As' Modal
     */
    handleSave() {
        if (this.state.projectName !== '') {
            // should save existing document with no further input from user
            this.pdb.upsertDoc();
        } else {
            // else show modal so user can name the project
            this.setState({ showSaveModal: true });
        }
    }
    /**
     * reset everything to default
     */
    newProject() {
        this.uniqueID = this.generateUniqueID(10);
        this.pdb.setupProjectDoc(this.uniqueID, '', InitialContent);
        this.setState({ projectName: '', code: this.pdb.project.projectData });
        history.pushState({ "id": 1 }, "", "");
    }
    /**
     * (file -> open) this is called once pouch has retrieved docs from the DB, store all project names locally
     */
    storeProjects() {
        for (let row of this.pdb.dbContents.rows) {
            this.projects.push(row.doc);
        }
        this.setState({ projectsFromDB: this.projects, showOpenModal: true });
    }
    /**
     * find project in db using ID, and pass a callback to handle the response
     * this is what happens when a user has selected a project in the open modal
     * @param projectID
     */
    openProject(projectID) {
        this.pdb.findSingleDoc(projectID, this.loadProject);
    }
    /**
     * callback called once pouchdb has found correct project (on open modal)
     * @param proj
     */
    loadProject(proj) {
        // proj is response from pouchdb, set up project in editor
        this.uniqueID = proj._id;
        // setting state will force a render
        this.setState({
            projectName: proj.projectName,
            code: proj,
            showOpenModal: false
        });
        // change URL to match project ID (first two values are dummy data)
        history.pushState({ "id": 1 }, "", this.uniqueID);
        // now join / create a socket.io room
        this.joinRoom(this.uniqueID, proj);
    }
    /**
     * when user clicks a filename, present the corrosponding file
     * @param fileName
     */
    selectFile(fileName) {
        this.setState({ activeFile: fileName });
    }
    /**
     * patches server code to local code, after a user has come back online
     */
    patchServerCode() {
        this.setState({ code: this.state.serverCode, offlineMode: false, status: 'connected' });
        this.setState({ showDiffModal: false });
    }
    /**
     * User returning online, patch server code
     */
    pushToServer() {
        socket.emit('codeChange', {
            id: this.uniqueID,
            project: this.pdb.project.projectData,
            cursorPos: this.state.cursorPos,
            activeFile: this.state.activeFile
        });
        this.setState({ offlineMode: false, status: 'connected' });
        this.setState({ showDiffModal: false });
    }
    /**
     * take the projects content and make a new project out of it
     */
    forkProject() {
        socket.emit('leave room', { id: this.uniqueID });
        this.setState({
            offlineMode: false,
            status: 'connected',
            projectName: ''
        }, function () {
            this.uniqueID = this.generateUniqueID(10);
            // handle save as if new project
            this.handleSave();
        }.bind(this));
        this.setState({ showDiffModal: false });
    }
    /**
     * using project-parser.js, insert library between head tags
     * @param index
     */
    insertLibrary(index) {
        this.parser.insertLibrary(index, this.state.code, changeState.bind(this));
        function changeState(code) {
            this.pdb.project.projectData = code;
            this.setState({
                code: code
            });
            if (this.state.projectName !== '') {
                this.emitCodeChange();
            }
        }
    }

    render() {
        let previewHeight = this.state.pageHeight / 100 * 60;
        let style = {
            container: {
                paddingRight: 0,
                paddingLeft: 0
            },
            row: {
                height: this.state.pageHeight
            },
            hub: {
                height: this.state.pageHeight - previewHeight,
                borderTop: '1px solid black'
            }
        };
        return (
            <Grid fluid style={style.container}>
                <Header
                    className="header"
                    title={this.state.title}
                    onSave={this.handleSave}
                    onNew={this.newProject}
                    onOpen={ event => this.pdb.getDocs(this.storeProjects)}
                    fork={this.forkProject}
                    deleteProject={this.deleteProject}
                    status={this.state.status}
                    goOffline={ event => this.setState({ status: 'disconnected', offlineMode: true }) }
                    goOnline={this.goOnline}
                    connectionStatus={this.state.offlineMode}
                    />
                <Row style={style.row}>
                    <FileTabs
                        onSelectFile={this.selectFile}
                        fileNames={this.state.code.files}
                        activeFile={this.state.activeFile}
                        />
                    <Pad
                        onChange={this.handlePadChange}
                        code={this.state.code}
                        cursorPos={this.state.cursorPos}
                        height={this.state.pageHeight}
                        activePad={this.state.activeFile}
                        />
                    <Col lg={5}>
                        <Row>
                            <Preview
                                code={this.state.code}
                                height={previewHeight}
                                />
                        </Row>
                        <Row style={style.hub} className="hub">
                            <Hub
                                insertLibrary={this.insertLibrary}
                                socket={socket}
                                id={this.uniqueID}
                                />
                        </Row>
                    </Col>
                </Row>
                <SaveModal
                    modalTitle='Project Name'
                    onChange={event => this.setState({ projectName: event }) }
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
                    buttonClick={ event => this.setState({ showOpenModal: false }) }
                    selectProject={ this.openProject }
                    />
                <DiffModal
                    show={this.state.showDiffModal}
                    code={this.state.code.files}
                    serverCode={this.state.serverCode.files}
                    close={this.closeDiffModal}
                    applyServerChanges={this.patchServerCode}
                    pushToServer={this.pushToServer}
                    forkProject={this.forkProject}
                    />
            </Grid>
        );
    }
}