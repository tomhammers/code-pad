import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { newProject, showOpenServerProjModal, showSaveModal, showOpenModal } from '../actions/index';
import { ButtonToolbar, Button, DropdownButton, SplitButton, MenuItem, Tooltip, OverlayTrigger} from 'react-bootstrap';

import OpenServerModal from '../components/open-server-modal';

class Menu extends Component {

    constructor(props) {
        super(props);

        this.htmlfiles = [];
        this.cssfiles = [];
        this.jsfiles = [];

        this.state = {
            serverProjects: []
        }

        this.new = this.new.bind(this);
        this.open = this.open.bind(this);
        this.fork = this.fork.bind(this);
        this.goOffline = this.goOffline.bind(this);
        this.goOnline = this.goOnline.bind(this);
        this.openNewTab = this.openNewTab.bind(this);
        this.openServerProjects = this.openServerProjects.bind(this);
    }

    componentWillMount() {
        this.props.socket.on('serverProjects', (data) => {
            console.log(data);
            this.setState({ serverProjects: data.projects });
            //this.props.showOpenServerProjModal();
        });
    }

    /**
     * 
     * Handle different menu events
     * 
     */

    new() {
        this.props.newProject();
        this.props.onNew();
    }

    fork() {
        this.props.fork();
    }

    open() {
        this.props.showOpenModal();
        this.props.onOpen();
    }

    openServerProjects() {
        this.props.socket.emit('requestProjects');
        this.props.showOpenServerProjModal();
    }

    goOffline() {
        this.props.stopStramingEditor();
    }

    goOnline() {
        this.props.startStreamingEditor();
    }

    startTogetherJS() {
        TogetherJS();
    }
    /**
     * opens new browser tab and generates preview of users code
     */
    openNewTab() {
        let NewTab = window.open();
        NewTab.document.open();

        for (let i = 0, l = this.props.files.length; i < l; i++) {
            if (this.props.files[i].fileType === 'html') {
                this.htmlfiles.push(this.props.files[i].content);
            }
            if (this.props.files[i].fileType === 'css') {
                this.cssfiles.push(this.props.files[i].content);
            }
            if (this.props.files[i].fileType === 'javascript') {
                this.jsfiles.push(this.props.files[i].content);
            }
        }

        for (let i = 0, l = this.htmlfiles.length; i < l; i++) {
            console.log(this.htmlfiles[i]);
            NewTab.document.write(this.htmlfiles[i])
        }
        for (let i = 0, l = this.cssfiles.length; i < l; i++) {
            NewTab.document.write(`<style type=\"text/css\">${this.cssfiles[i]}</style>`);
        }
        for (let i = 0, l = this.jsfiles.length; i < l; i++) {
            NewTab.document.write(`<script>${this.jsfiles[i]}</script>`);
        }

        NewTab.document.close();

        this.htmlfiles = [];
        this.cssfiles = [];
        this.jsfiles = [];
    }


    render() {
        let style = {
            buttons: {
                backgroundColor: "#e0e0e0",
                border: "none",
                fontSize: "14px"
            },
            outer: {
                backgroundColor: "#e0e0e0",
                color: "black"
            }
        }
        return (
            <div style={style.outer}>
                <ButtonToolbar>
                    <DropdownButton style={style.buttons} bsStyle="default" bsSize="small" title="File">
                        <MenuItem eventKey={1.1} onSelect={this.new}>New Project</MenuItem>
                        <MenuItem divider/>
                        <OverlayTrigger id="54335465765646" placement="right" overlay={<Tooltip id="48d498566">Retrieves projects locally from your browser's' database</Tooltip>}>
                            <MenuItem eventKey={1.2} onSelect={this.open}>Open Local Project</MenuItem>
                        </OverlayTrigger>
                        <OverlayTrigger id="75497345957934567" placement="right" overlay={<Tooltip id="48d498566">Retrieves projects from the cloud</Tooltip>}>
                            <MenuItem eventKey={1.3} onSelect={this.openServerProjects}>Open Server Project</MenuItem>
                        </OverlayTrigger>
                        <MenuItem divider/>
                        <MenuItem
                            eventKey={1.4}
                            onSelect={this.props.projectName === '' ? this.props.showSaveModal : null}>
                            Save Project
                        </MenuItem>
                        <OverlayTrigger id="75497345957934567" placement="right" overlay={<Tooltip id="48498566">Takes the current project and creates a brand new project</Tooltip>}>
                            <MenuItem eventKey={1.5} onSelect={this.fork}>Fork Project</MenuItem>
                        </OverlayTrigger>
                    </DropdownButton>

                    <DropdownButton style={style.buttons} bsStyle="default" bsSize="small" title="Share">
                        <OverlayTrigger id="754973459e7934567" placement="right" overlay={<Tooltip id="48dwe2498566">Share project with others, all user actions on editor are kept in sync.(uses write lock timer) </Tooltip>}>
                            <MenuItem disabled={this.props.editorStreaming !== false} eventKey={3.1} onSelect={this.goOnline}>
                                Start Streaming Editor
                            </MenuItem>
                        </OverlayTrigger>
                        <MenuItem disabled={this.props.editorStreaming === false} eventKey={3.2} onSelect={this.goOffline}>
                            Stop Streaming Editor
                        </MenuItem>
                        <MenuItem divider/>
                        <OverlayTrigger id="754973e4597934567" placement="right" overlay={<Tooltip id="48dwe2498566">Multiple changes to project simultanously with TogetherJS </Tooltip>}>
                            <MenuItem eventKey={3.3} onSelect={this.startTogetherJS}>Toggle Real Time Collaboration</MenuItem>
                        </OverlayTrigger>
                    </DropdownButton>

                    <DropdownButton style={style.buttons} bsStyle="default" bsSize="small" title="View">
                        <OverlayTrigger id="754973459e7934567" placement="right" overlay={<Tooltip id="48dwe2498566">View Preview of the project in a new tab</Tooltip>}>
                            <MenuItem eventKey={4.1} onSelect={this.openNewTab}>
                                View in New Tab
                            </MenuItem>
                        </OverlayTrigger>
                    </DropdownButton>

                    <DropdownButton style={style.buttons} bsStyle="default" bsSize="small" title="Help">
                        <MenuItem eventKey={5.1} href="https://github.com/tomhammers/code-pad">
                            See Project Code on GitHub
                        </MenuItem>
                        <MenuItem eventKey={5.2} href="https://github.com/tomhammers/code-pad/issues">
                            Report an Issue
                        </MenuItem>

                    </DropdownButton>

                </ButtonToolbar>
                <OpenServerModal projects={this.state.serverProjects} onServerLoad={this.props.onServerLoad}/>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        editorStreaming: state.editorStreaming,
        files: state.files,
        projectName: state.projectName,
        showOpenServerProjectsModal: state.showOpenServerProjectsModal
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        newProject: newProject,
        showOpenModal: showOpenModal,
        showSaveModal: showSaveModal,
        showOpenServerProjModal: showOpenServerProjModal
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);