import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class OpenModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectItems: ''
        };

        this.close = this.close.bind(this);
        this.whenClicked = this.whenClicked.bind(this);
        this.setProjectNames = this.setProjectNames.bind(this);
    }
    /**
     * render project names in the modal
     */
    setProjectNames() {
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
                    onClick={ () => this.whenClicked(project._id) }
                    className="list-group-item highlight"
                    >
                    {project.projectName}
                </li>
            );
        })

    }

    close() {
        this.props.onClose();
    }
    
    /**
     * open the selected project, this calls a method in the parent component
     * @param projectID
     */
    whenClicked(projectID) {
        this.props.selectProject(projectID);
    }

    render() {

        return (
            <Modal show={this.props.show} onHide={this.close}>

                <Modal.Header closeButton>
                    <Modal.Title>Choose Project</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ul className="list-group">
                        {this.setProjectNames() }
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>

            </Modal>
        );
    }

}



