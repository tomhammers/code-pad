import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeDiffModal, generateProjectId, updateCode, saveProject, selectFile, setProjectId, showDiffModal,
  showSaveModal, startStreamingEditor, stopStreamingEditor, goOnline, goOffline, updateCursor } from '../actions/index';
import { Grid, Row, Col }     from 'react-bootstrap';
import _                      from 'lodash';
import Header                 from '../components/header';
import Menu                   from '../components/menu';
import SideBar                from '../components/sidebar';
import Pad                    from '../components/pad';
import Preview                from './preview';
import Hub                    from '../components/hub';
import SaveModal              from '../components/save-modal';
import OpenModal              from '../components/open-modal';
import DiffModal              from '../components/diff-modal';

import Pouch                  from '../utils/pouchdb';
import Parser                 from '../utils/project-parser.js';
import io                     from 'socket.io-client';
const socket = io();

class App extends Component {
  constructor(props) {
    super(props);
    this.projects = [];
    this.pdb = new Pouch();
    this.parser = new Parser();
    // create local DB if one doesn't exist (pouch ignores otherwise)
    this.pdb.createDB('projects');
    // look at the URL and attempt to extract project ID
    const id = window.location.href.split("/").pop();
    if (id !== '') this.props.setProjectId(id);
    // if project ID not present, set up a new one
    if (id === '') this.props.generateProjectId();

    this.state = {
      loading: true,
      pageHeight: 0,
      projectsFromDB: [],
      serverCode: { files: [{ content: "" }] },
      showOpenModal: false
    };

    this.compareProjects = this.compareProjects.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.insertLibrary = this.insertLibrary.bind(this);
    this.forkProject = this.forkProject.bind(this);
    this.handlePadChange = this.handlePadChange.bind(this);
    this.loadProject = this.loadProject.bind(this);
    this.newProject = this.newProject.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.openProject = this.openProject.bind(this);
    this.projectChange = this.projectChange.bind(this);
    this.pushToServer = this.pushToServer.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.setupProject = this.setupProject.bind(this);
    this.startStreamingEditor = this.startStreamingEditor.bind(this);
    this.stopStramingEditor = this.stopStramingEditor.bind(this);
    this.storeProjects = this.storeProjects.bind(this);
  }
  /**
   * File -> New
   */
  newProject() {
    socket.emit('leave room', { id: this.props.projectId });
    this.props.stopStreamingEditor();
    this.props.generateProjectId();
    history.pushState({ "id": 1 }, "", this.props.projectId);
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
    this.props.startStreamingEditor();
    this.props.setProjectId(proj._id);
    // setting state will force a render
    this.setState({ showOpenModal: false });
    this.props.updateCode(proj.files, proj.projectName);

    // change URL to match project ID (first two values are dummy data)
    history.pushState({ "id": 1 }, "", this.props.projectId);
    // now join / create a socket.io room
    this.joinRoom(this.props.projectId, proj);
  }
  /**
   * After user has given project a name 
   * If project exists, this gets called on editor change
   */
  saveProject() {
    this.props.startStreamingEditor();
    setTimeout(() => {
      this.pdb.setupProjectDoc(this.props.projectId, this.props.projectName, this.props.files);
      this.pdb.upsertDoc();
      this.joinRoom(this.props.projectId, this.pdb.project.projectData);
      // change the URL, this is now the project's unique URL(first 2 values dummy data)
      history.pushState({ "id": 1 }, "", this.props.projectId);
    }, 50);
  }
  /**
  * take the projects content and make a new project out of it
  */
  forkProject() {
    // TODO: handle user closing save modal ie they don't actually fork
    socket.emit('leave room', { id: this.props.projectId });
    this.props.stopStreamingEditor();
    this.props.generateProjectId();
    // handle save as if new project
    this.props.showSaveModal();

    this.props.closeDiffModal();
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
   * on response to socket.io event 'setupProject', sets up application to match server's version of project
   */
  setupProject(data) {
    this.props.startStreamingEditor();
    // setting up data response from server
    this.props.setProjectId(data.project.projectData._id);
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
      // if project was previously saved
      if (this.props.projectName !== '') {
        // emit to server, if in online mode
        if (this.props.editorStreaming) {
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
    console.log("emitting");
    socket.emit('codeChange', {
      id: this.props.projectId,
      project: this.pdb.project.projectData,
      cursorPos: this.props.cursorPos,
      activeFile: this.props.activeFile,
      streamingMode: this.props.editorStreaming
    });
  }
  /**
   * incoming changes from socket.io
   */
  projectChange(data) {
    if (this.props.editorStreaming) {
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
  startStreamingEditor() {
    // request latest project from the server
    if (this.props.projectName !== '') {
      socket.emit('requestLatestProject', { id: this.props.projectId });
    } else { // this project hasn't even been saved!
      this.props.showSaveModal();
    }
  }

  stopStramingEditor() {
    this.props.stopStreamingEditor();
  }

  pushToServer() {
    this.emitCodeChange();
    this.props.startStreamingEditor();
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
        this.props.startStreamingEditor();
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

  fetchServerProjects() {
    console.log("called");
  }

  onConnect() {
    console.log("connected");
    this.props.goOnline();
    if (this.props.projectId !== '') {
      this.joinRoom(this.props.projectId, null)
    }
    if (this.props.projectName !== '') {
      socket.emit('requestLatestProject', { id: this.props.projectId });
    }
  }

  onDisconnect() {
    this.props.goOffline();
    console.log("disconnected!!!");
  }

  /**
  * React cycle, before the DOM is rendered
  */
  componentWillMount() {

    // listen for server events and call the corrosponding method
    socket.on('connect', this.onConnect);
    socket.on('disconnect', this.onDisconnect);
    socket.on('setupProject', this.setupProject);
    socket.on('projectChange', this.projectChange);
    socket.on('inRoom', () => { this.props.goOnline() });
    socket.on('latestProject', this.compareProjects);
  }

  /**
  * React cycle, after the DOM is rendered
  */
  componentDidMount() {
    window.addEventListener("load", function () {
      var load_screen = document.getElementById("load_screen");
      load_screen.parentNode.removeChild(load_screen);
    });
    // get the window height - header height
    let fullPageHeight = document.getElementById('app').offsetHeight;
    let headerHeight = document.getElementsByClassName('navbar')[0].offsetHeight;
    let menubar = document.getElementsByClassName('btn-toolbar')[0].offsetHeight;
    this.setState({ pageHeight: fullPageHeight - headerHeight - menubar - 5 });
  }

  componentWillReceiveProps(nextProps) {
    // check project has been setup / saved before doing anything (checks object is empty)

    if (this.props.files.length !== nextProps.files.length) {
      // update files (if true)
      this.pdb.project.projectData.files = nextProps.files;

      if (this.props.projectName !== '') {
        // emit to server, if in streaming mode
        if (this.props.editorStreaming) {
          this.emitCodeChange();
        }
        //  save existing project in local db
        this.pdb.upsertDoc();
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
      header: {
        paddingLeft: "0px"
      },
      row: {
        height: this.state.pageHeight
      },
      hub: {
        height: this.state.pageHeight - previewHeight,
        borderTop: '1px solid black'
      },
    };

    return (
      <Grid fluid style={style.container}>

        <Header
          style={style.header}
          />
        <Menu
          className="menubar"
          onNew={this.newProject}
          onOpen={ event => this.pdb.getDocs(this.storeProjects) }
          onOpenServerProjects={this.fetchServerProjects}
          onServerLoad={this.saveProject}
          fork={this.forkProject}
          stopStramingEditor={this.stopStramingEditor}
          startStreamingEditor={this.startStreamingEditor}
          socket={socket}
          />
        <Row>
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
        <OpenModal
          onClose={ event => this.setState({ showOpenModal: false }) }
          show={this.state.showOpenModal}
          projects={this.projects}
          selectProject={this.openProject}
          />

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


// applications (redux) state to props, look in reducers/index;
function mapStateToProps(state) {
  return {
    activeFile: state.activeFile,
    cursorPos: state.cursorPos,
    editorStreaming: state.editorStreaming,
    files: state.files,
    projectId: state.projectId,
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
    closeDiffModal: closeDiffModal,
    generateProjectId: generateProjectId,
    goOnline: goOnline,
    goOffline: goOffline,
    updateCode: updateCode,
    saveProject: saveProject,
    selectFile: selectFile,
    setProjectId: setProjectId,
    showDiffModal: showDiffModal,
    showSaveModal: showSaveModal,
    startStreamingEditor: startStreamingEditor,
    stopStreamingEditor: stopStreamingEditor,
    updateCursor: updateCursor
  }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(App);
