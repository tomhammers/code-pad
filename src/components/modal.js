import React, { Component } from 'react';
import ReactBootstrap, { Modal, Input } from 'react-bootstrap';

import Button from './button';

export default class ModalComponent extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.whenChanged = this.whenChanged.bind(this);
    }

    handleClick() {
        this.props.buttonClick();
    }

    whenChanged(event) {
        this.props.onChange('saveAsInput', event.target.value);
    }

    render() {
        return (
            <Modal show={this.props.show}>

                <Modal.Header>
                    <Modal.Title>{ this.props.modalTitle }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {(() => {
                        switch (this.props.modalTitle) {
                            case 'Save':
                                return ([
                                <h6
                                    key={this.props.modalTitle}>Save As:
                                </h6>,
                                <Input key="133445323"
                                       type="text"
                                       value={this.props.inputValue}
                                       onChange={this.whenChanged}
                                />
                                ]);
                            case 'Open Project':
                                console.log(this.props.projects);
                                for(let project of this.props.projects) {
                                    console.log(gg);
                                }
                        }
                    })()}
                </Modal.Body>

                <Modal.Footer>
                    <Button whenClicked={this.handleClick} buttonTitle={this.props.buttonTitle} />

                </Modal.Footer>

            </Modal>

        );
    }
}