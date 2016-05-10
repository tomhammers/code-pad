import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeDiffModal, goOnline, updateCode, startStreamingEditor } from '../actions/index';
import ReactBootstrap, { Modal, DropdownButton, MenuItem } from 'react-bootstrap';
import Diff from 'react-diff';

class DiffModal extends Component {
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
    
    close() {
        this.props.closeDiffModal();
    }

    setUpDiffs() {
        return this.props.files.map((file, i) => {
            if (this.props.serverCode[i] !== undefined) {
                return (
                    <div>
                        {this.props.serverCode[i].fileName}
                        <Diff
                            key={file.fileName}
                            inputA={file.content}
                            inputB={this.props.serverCode[i].content}
                            type="chars"
                        />
                    </div>
                );
            }
        });
    }

    acceptServerChanges() {
        this.props.updateCode(this.props.serverCode, this.props.projectName);
        this.props.startStreamingEditor();
    }

    pushChangesToServer(){
        this.props.pushToServer();
    }

    forkProject(){
        this.props.forkProject();
    }

    render() {
        const style = {
            modal: {
                color: 'black'
            }
        }
        return (
            <Modal style={style.modal} bsSize="large" show={this.props.show} onHide={this.close}>
                <Modal.Header closeButton>
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
                    <p>Server Copy: </p>
                    {this.setUpDiffs()}
                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        );
    }

}


function mapStateToProps(state) {
    return {
        files: state.files,
        projectName: state.projectName,
        show: state.showDiffModal
    };
}
/**
 * Anything returned from this function will end up as props
 * dispatch takes all actions and makes sure they are passed to all the reducers
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        updateCode: updateCode, 
        goOnline: goOnline, 
        closeDiffModal: closeDiffModal, 
        startStreamingEditor:  startStreamingEditor}, 
     dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(DiffModal);