import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class OpenModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectItems: ''
        };

        this.whenClicked = this.whenClicked.bind(this);
        this.setProjectItems = this.setProjectItems.bind(this);
    }

    componentWillUnmount() {

    }

    whenClicked(projectID) {
        this.props.selectProject(projectID);
    }


    setProjectItems() {
        this.props.projects.map((project, i) => {
            return (
                <li
                    key={i}
                    onClick={ () => this.whenClicked(project._id) }
                    className="list-group-item"
                >
                    {project.projectName}
                </li>
            );
        });
    }


    render() {
        let style = {
            listitems: {
                cursor: 'pointer'
            }
        };

        return (
            <Modal show={this.props.show}>

                <Modal.Header>
                    <Modal.Title>Choose Project</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ul className="list-group">
                        {this.props.projects.map((project, i) => {
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
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>

            </Modal>
        );
    }

}



