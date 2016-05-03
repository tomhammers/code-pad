import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCode, saveProject, selectFile, showDiffModal, showSaveModal, goOnline, goOffline, updateCursor } from '../actions/index';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import Header from '../containers/header';
import SideBar from '../containers/sidebar';
import Pad from '../containers/pad';
import Preview from './preview';
import Hub from '../containers/hub';
import SaveModal from '../containers/save-modal';
import OpenModal from '../components/open-modal';
import DiffModal from '../containers/diff-modal';

import Pouch from '../utils/pouchdb';
import Parser from '../utils/project-parser.js';
import io from 'socket.io-client';
const socket = io();

class App extends Component {
  constructor(props) {
    super(props);
    this.projects = [];
    this.pdb = new Pouch();
    this.parser = new Parser();
    // create local DB if one doesn't exist (pouch ignores otherwise)
    this.pdb.createDB('projects');

    this.uniqueID = window.location.href.split("/").pop();
    // if didn't find one set a new one
    if (this.uniqueID === '') {
      this.uniqueID = this.generateUniqueID(10);
    }

    this.state = {
      pageHeight: 0,
      projectsFromDB: [],
      serverCode: { files: [{ content: "" }] },
      showOpenModal: false
    };

    this.compareProjects = this.compareProjects.bind(this);
    this.insertLibrary = this.insertLibrary.bind(this);
    this.newProject = this.newProject.bind(this);
    this.openProject = this.openProject.bind(this);
    this.loadProject = this.loadProject.bind(this);
    this.pushToServer = this.pushToServer.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.forkProject = this.forkProject.bind(this);
    this.setupProject = this.setupProject.bind(this);
    this.handlePadChange = this.handlePadChange.bind(this);
    this.projectChange = this.projectChange.bind(this);
    this.storeProjects = this.storeProjects.bind(this);
    this.goOnline = this.goOnline.bind(this);
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

  newProject() {
    socket.emit('leave room', { id: this.uniqueID });
    this.uniqueID = this.generateUniqueID(10);
    history.pushState({ "id": 1 }, "", this.uniqueID);
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
    this.pdb.project.projectData = proj;
    // proj is response from pouchdb, set up project in editor
    this.uniqueID = proj._id;
    // setting state will force a render
    this.setState({ showOpenModal: false });
    this.props.updateCode(proj.files, proj.projectName);

    // change URL to match project ID (first two values are dummy data)
    history.pushState({ "id": 1 }, "", this.uniqueID);
    // now join / create a socket.io room
    this.joinRoom(this.uniqueID, proj);
  }

  saveProject() {
    setTimeout(
      () => {
        this.pdb.setupProjectDoc(this.uniqueID, this.props.projectName, this.props.files);
        this.pdb.upsertDoc();
        this.joinRoom(this.uniqueID, this.pdb.project.projectData);
        // change the URL, this is now the project's unique URL(first 2 values dummy data)
        history.pushState({ "id": 1 }, "", this.uniqueID);
      }
      , 50);
  }

  /**
  * take the projects content and make a new project out of it
  */
  forkProject() {
    socket.emit('leave room', { id: this.uniqueID });
    this.props.saveProject('');
    this.uniqueID = this.generateUniqueID(10);
    // handle save as if new project
    this.props.showSaveModal();

    this.setState({ showDiffModal: false });
  }

  /**
  * Sends request to sever to join or create a socket.io room for project, optionally send project
  * @param id
  * @param project
  */
  joinRoom(id, project) {
    socket.emit('joinRoom', { id: id, project: project });
  }

  setupProject(data) {
    // setting up data response from server
    this.uniqueID = data.project.projectData._id;
    //this.setState({ code: data.project.projectData, projectName: data.project.projectData.projectName });
    this.props.updateCode(data.project.projectData.files, data.project.projectData.projectName);
    // put a copy in clients local DB for offline use
    this.pdb.project.projectData = data.project.projectData;
    this.pdb.upsertDoc();
  }
  /**
  * Whenever a user changes something in a pad
  * @param pads
  * @param cursorPos
  */
  handlePadChange(pads, cursorPos) {
    if (this.props.projectName !== '') {
      // loop through all pads and get their value, update the projectDoc
      for (let i = 0, l = pads.length; i < l; i++) {
        this.pdb.project.projectData.files[i].content = pads[i].getSession().getValue();
      }
      // setState will cause React to re render all components
      //this.setState({ cursorPos: cursorPos });
      // if project was previously saved
      if (this.props.projectName !== '') {
        // emit to server, if in online mode
        if (!this.props.offlineMode) {
          this.emitCodeChange();
        }
        //  save existing project in local db
        this.pdb.upsertDoc();
      }
    }
  }

  /**
  * Send code change to server
  */
  emitCodeChange() {
    console.log(this.props.cursorPos);
    socket.emit('codeChange', {
      id: this.uniqueID,
      project: this.pdb.project.projectData,
      cursorPos: this.props.cursorPos,
      activeFile: this.props.activeFile
    });
  }

  /**
   * incoming changes from socket.io
   */
  projectChange(data) {
    if (!this.props.offlineMode) {
      this.props.updateCursor(data.cursorPos);
      this.props.updateCode(data.code.files, data.code.projectName);  
      this.props.selectFile(data.activeFile);
    }
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
  * When user goes online, either checks for existing project or set a new one up
  */
  goOnline() {
    // request latest project from the server
    if (this.props.projectName !== '') {
      socket.emit('requestLatestProject', { id: this.uniqueID });
    } else { // this project hasn't even been saved!
      this.saveProject();
    }
  }

  pushToServer() {
    this.emitCodeChange();
    this.props.goOnline();
  }

  /**
  * Opens Modal so user can view differences between projects
  * @param data
  */
  compareProjects(data) {
    this.setState({
      serverCode: data.project.files
    }, function () {
      // only open if project is different to server's copy
      if (!(_.isEqual(this.props.files, this.state.serverCode))) {
        this.props.showDiffModal();
      } else {
        // if project is the same, just put the user online
        this.props.goOnline();
      }
    });
  }

  /**
  * using project-parser.js, insert library between head tags
  * @param index
  */
  insertLibrary(index) {
    // make a copy BY VALUE as we can't mutate the props
    let code = JSON.parse(JSON.stringify(this.props.files));
    // this new copy can now be passed to the parser
    this.parser.insertLibrary(index, code, changeState.bind(this));
    // callback called once parser has finished
    function changeState(code) {
      this.props.updateCode(code, this.props.projectName);
      if (this.props.projectName !== '' && this.props.offlineMode !== true) {
        this.pdb.project.projectData.files = code;
        this.emitCodeChange();
      }
    }
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
    socket.on('inRoom', () => { this.props.goOnline() });
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

  render() {
    let previewHeight = this.state.pageHeight / 100 * 60;
    let style = {
      container: {
        paddingRight: 0,
        paddingLeft: 0
      },
      header: {
        paddingLeft: "0px"
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
          onNew={this.newProject}
          onOpen={ event => this.pdb.getDocs(this.storeProjects) }
          fork={this.forkProject}
          connectionStatus={this.props.offlineMode}
          goOffline={ event => this.props.goOffline() }
          goOnline={this.goOnline}
          />
        <Row id="fullScreen">
          <SideBar />
            <Pad height={this.state.pageHeight} onChange={this.handlePadChange} />
          <Col lg={5}>
            <Row>
              <Preview height={previewHeight} />
            </Row>
            <Row style={style.hub} className="hub">
              <Hub socket={socket} insertLibrary={this.insertLibrary}/>
            </Row>
          </Col>
        </Row>
        <SaveModal save={this.saveProject}/>
        <OpenModal show={this.state.showOpenModal} projects={this.projects} selectProject={this.openProject}/>
        <DiffModal
          serverCode={this.state.serverCode}
          close={event => this.setState({ showDiffModal: false }) }
          pushToServer={this.pushToServer}
          forkProject={this.forkProject}
          />
      </Grid>
    );
  }
}


// applications state to props, look in reducer/index; files will be found there
function mapStateToProps(state) {

  return {
    activeFile: state.activeFile,
    cursorPos: state.cursorPos,
    files: state.files,
    projectName: state.projectName,
    offlineMode: state.offlineMode,
    showOpenModal: state.showOpenModal
  };
}
/**
 * Anything returned from this function will end up as props
 * dispatch takes all actions and makes sure they are passed to all the reducers
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    goOnline: goOnline,
    goOffline: goOffline,
    updateCode: updateCode,
    saveProject: saveProject,
    selectFile: selectFile,
    showDiffModal: showDiffModal,
    showSaveModal: showSaveModal,
    updateCursor: updateCursor
  }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(App);
