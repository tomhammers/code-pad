import React, { Component } from 'react';
import ReactBootstrap, { Modal, Input } from 'react-bootstrap';

import Button from './button';

export default class SaveModal extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.whenChanged = this.whenChanged.bind(this);
    }

    handleClick() {
        this.props.buttonClick();
    }

    whenChanged(event) {
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <Modal show={this.props.show} bsSize="small">

                <Modal.Header closeButton>
                    <Modal.Title>Give Project a Name:</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Input key="133445323"
                           type="text"
                           value={this.props.inputValue}
                           onChange={this.whenChanged}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button whenClicked={this.handleClick} buttonTitle={this.props.buttonTitle}/>

                </Modal.Footer>

            </Modal>

        );
    }
}
