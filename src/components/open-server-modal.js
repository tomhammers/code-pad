import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeOpenServerProjectsModal, setProjectId, showOpenServerProjModal, updateCode, updateCursor } from '../actions/index';

import { Modal } from 'react-bootstrap';

class OpenServerProjectsModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectItems: ''
        };

        this.close = this.close.bind(this);
        this.whenClicked = this.whenClicked.bind(this);
        this.setProjectItems = this.setProjectItems.bind(this);
    }

    close() {
        this.props.closeOpenServerProjectsModal();
    }

    whenClicked(projectID) {
        this.props.setProjectId(projectID);
        const l = this.props.projects.length;
        let project = {};
        for (let i = 0; i < l; i++) {
            if (this.props.projects[i].id === projectID) {
                project = this.props.projects[i].doc
            }
        }

        this.props.updateCode(project.files, project.projectName);
        this.props.updateCursor(project.cursorPos);
        setTimeout(() => {
            history.pushState({ "id": 1 }, "", this.props.projectId);
        }, 50);  
        // 'save' needs to be called in app.js, calling this will invoke it
        this.props.onServerLoad(); 
        this.props.closeOpenServerProjectsModal();
    }


    setProjectItems() {
        let style = {
            listitems: {
                cursor: 'pointer'
            }
        };
           
        return this.props.projects.map((project, i) => {
            return (
                <li
                    style={style.listitems}
                    key={i}
                    onClick={ () => this.whenClicked(project.id) }
                    className="list-group-item highlight"
                    >
                    {project.doc.projectName}
                </li>
            );
        });
    }

    render() {
        return (
            <Modal show={this.props.showOpenServerProjectsModal} onHide={this.close}>

                <Modal.Header closeButton>
                    <Modal.Title>Choose Project</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ul className="list-group">
                        {this.setProjectItems()}
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>

            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {
        projectId: state.projectId,
        showOpenServerProjectsModal: state.showOpenServerProjectsModal
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        closeOpenServerProjectsModal: closeOpenServerProjectsModal,
        setProjectId: setProjectId,
        showOpenServerProjModal: showOpenServerProjModal,
        updateCode: updateCode,
        updateCursor: updateCursor
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenServerProjectsModal);
