import React, { Component } from 'react';
import ReactBootstrap, { Modal } from 'react-bootstrap';

export default class DiffModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Modal>

                <Modal.Header>
                    <Modal.Title>Accept Changes?</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                </Modal.Body>

                <Modal.Footer>
                </Modal.Footer>

            </Modal>
        );
    }

}