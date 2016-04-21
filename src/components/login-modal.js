import React, { Component } from 'react';
import { Modal, Input, Button } from 'react-bootstrap';

export default class Login extends Component {

    render() {
        return (
            <Modal show={this.props.show}>
                <Modal.Body>
                    <form>
                        <Input
                            type="text"
                            placeholder="Username"
                            value={this.props.usernameValue}
                            onChange={this.whenChanged}/>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={this.props.passwordValue}
                            onChange={this.whenChanged}
                            />

                        <Button
                            bsStyle="primary"
                            onClick={}
                            >
                            Login
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
}