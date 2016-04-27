import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactBootstrap, { Modal, Input, Button } from 'react-bootstrap';

import { showSaveModal, saveProject } from '../actions/index';


class SaveModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            saveInput: ''
        };

        this.handleClick = this.handleClick.bind(this);
        this.whenChanged = this.whenChanged.bind(this);
    }

    handleClick() {
        this.props.saveProject(this.state.saveInput);
        this.props.save();
        this.setState({ saveInput: '' });
    }

    whenChanged(event) {
        this.setState({ saveInput: event.target.value });      
    }

    render() {
        return (
            <Modal show={this.props.show} bsSize="small">

                <Modal.Header closeButton>
                    <Modal.Title>Give Project a Name:</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Input key="1asd"
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
    // when selectBook is called, result should be passed to reducers
    return bindActionCreators({ 
           saveProject: saveProject
     }, 
     dispatch)
}
// produces a container (is aware of state)
// promote booklist to container - needs to know about dispatch method
export default connect(mapStateToProps, mapDispatchToProps)(SaveModal);