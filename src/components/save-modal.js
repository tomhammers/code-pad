import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactBootstrap, { Modal, FormControl, Button } from 'react-bootstrap';

import { closeSaveModal, showSaveModal, saveProject } from '../actions/index';


class SaveModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            saveInput: ''
        };

        this.close = this.close.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.whenChanged = this.whenChanged.bind(this);
    }

    close() {
        this.props.closeSaveModal();
    }
    /**
     * save the project when save button is clicked
     */
    handleClick() {
        if (this.state.saveInput.length > 3 && this.state.saveInput.length < 20) {
            this.props.saveProject(this.state.saveInput);
            this.props.save();
            this.setState({ saveInput: '' });
        } else {
            alert("Project Name should be between 3 and 20 characters long");
        }
    }
    /**
     * keep track of value in save input
     */
    whenChanged(event) {
        this.setState({ saveInput: event.target.value });
    }

    render() {
        return (
            <Modal show={this.props.show} bsSize="small" onHide={this.close}>

                <Modal.Header closeButton>
                    <Modal.Title>Give Project a Name: </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <FormControl key="1asd"
                        type="text"
                        value={this.props.inputValue}
                        onChange={this.whenChanged}
                        />
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        bsStyle="primary"
                        onClick={this.handleClick}
                        >
                        Save
                    </Button>
                </Modal.Footer>

            </Modal>

        );
    }
}

function mapStateToProps(state) {
    return {
        show: state.showSaveModal
    };
}
/**
 * Anything returned from this function will end up as props
 * dispatch takes all actions and makes sure they are passed to all the reducers
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        closeSaveModal: closeSaveModal,
        saveProject: saveProject
    },
        dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(SaveModal);