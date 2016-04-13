import React, { Component } from 'react';
import ReactBootstrap, { Modal, DropdownButton, MenuItem } from 'react-bootstrap';
import Diff from 'react-diff';
//import jsdiff from 'diff'
//import jsondiffpatch from 'jsondiffpatch';
//
//import 'jsondiffpatch/public/build/jsondiffpatch-formatters.min';
//import 'jsondiffpatch/src/formatters/html';

export default class DiffModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.showDiffModal
        };
        this.setUpDiffs = this.setUpDiffs.bind(this);
        this.close = this.close.bind(this);
        this.acceptServerChanges = this.acceptServerChanges.bind(this);
        this.pushChangesToServer = this.pushChangesToServer.bind(this);
        this.forkProject = this.forkProject.bind(this);
    }

    setUpDiffs() {
        return this.props.code.map((file, i) => {
            if (this.props.serverCode[i] !== undefined) {
                return (
                    <Diff
                        inputA={file.content}
                        inputB={this.props.serverCode[i].content}
                        type="chars"
                    />
                );
            }
        });
    }

    acceptServerChanges() {
        this.props.applyServerChanges();
    }

    pushChangesToServer(){
        this.props.pushToServer();
    }

    forkProject(){
        this.props.forkProject();
    }

    close() {
        this.props.close();
    }

    render() {
        return (
            <Modal bsSize="large" show={this.props.show}>

                <Modal.Header>
                    <Modal.Title>Review Changes</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Your project is out of sync with the server's copy, what would you like to do?</p>

                    <DropdownButton bsStyle="primary" title="Actions" id="dropdown-size-large">
                        <MenuItem eventKey="1" onSelect={this.acceptServerChanges} >Accept Changes below from Server</MenuItem>
                        <MenuItem eventKey="2" onSelect={this.pushChangesToServer}>Push Local Changes to Server</MenuItem>
                        <MenuItem eventKey="3" onSelect={this.forkProject}>Fork Project</MenuItem>
                        <MenuItem eventKey="4" onSelect={this.close} >Stay Offline</MenuItem>
                    </DropdownButton>
                    <br/>
                    {this.setUpDiffs()}

                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>

            </Modal>
        );
    }

}