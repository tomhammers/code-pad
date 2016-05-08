import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { newProject, showOpenServerProjModal, showSaveModal, showOpenModal } from '../actions/index';
import { ButtonToolbar, Button, DropdownButton, SplitButton, MenuItem} from 'react-bootstrap';

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
        this.props.goOffline();
    }

    goOnline() {
        this.props.goOnline();
    }

    startTogetherJS() {
        TogetherJS();
    }

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
    }

    openDevTools() {
        console.profile();
    }

    render() {
        let style = {
            buttons: {
                backgroundColor: "#e0e0e0",
                border: "none",
                fontSize: "12px"
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
                        <MenuItem eventKey={1.1} onSelect={this.new}>New</MenuItem>
                        <MenuItem eventKey={1.2} onSelect={this.open}>Open Local Project</MenuItem>
                        <MenuItem eventKey={1.3} onSelect={this.openServerProjects}>Open Server Project</MenuItem>
                        <MenuItem
                            eventKey={1.4}
                            onSelect={this.props.projectName === '' ? this.props.showSaveModal : null}>
                            Save
                        </MenuItem>
                        <MenuItem eventKey={1.5} onSelect={this.fork}>Fork</MenuItem>
                    </DropdownButton>

                    <DropdownButton style={style.buttons} bsStyle="default" bsSize="small" title="Share">
                        <MenuItem disabled={this.props.connectionStatus === false} eventKey={2.1} onSelect={this.goOnline}>
                            Start Streaming Editor
                        </MenuItem>
                        <MenuItem disabled={this.props.connectionStatus !== false} eventKey={2.2} onSelect={this.goOffline}>
                            Stop Streaming Editor
                        </MenuItem>
                        <MenuItem eventKey={2.3} onSelect={this.startTogetherJS}>Toggle Real Time Collaboration</MenuItem>
                    </DropdownButton>

                    <DropdownButton style={style.buttons} bsStyle="default" bsSize="small" title="View">
                        <MenuItem eventKey={3.1} onSelect={this.openNewTab}>
                            View in New Tab
                        </MenuItem>
                        <MenuItem eventKey={3.2} onSelect={this.openDevTools}>
                            Open Dev Tools
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