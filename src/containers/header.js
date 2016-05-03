import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button, ButtonToolbar, DropdownButton, SplitButton, Glyphicon } from 'react-bootstrap';

import { newProject, showSaveModal, showOpenModal } from '../actions/index';

class Header extends Component {
    constructor(props) {
        super(props);
        this.new = this.new.bind(this);
        this.open = this.open.bind(this);
        this.fork = this.fork.bind(this);
        this.goOffline = this.goOffline.bind(this);
        this.goOnline = this.goOnline.bind(this);
    }

    new() {
        this.props.newProject();
        this.props.onNew();
    }

    fork() {
        this.props.fork();
    }

    open() {
        this.props.showOpenModal();
        this.props.onOpen();
    }

    goOffline() {
        this.props.goOffline();
    }

    goOnline() {
        this.props.goOnline();
    }

    startTogetherJS() {
        TogetherJS();
    }



    render() {

        let style = {
            buttonToolbar: {
                paddingTop: "10px"
            },
            glyphs: {
                color: "grey"
            },
            headerStyle: {
                border: 0,
                backgroundColor: '#363636',
                borderBottom: '1px solid black',
            },
            logo: {
                paddingLeft: "5px",
                color: "white"
            },
            menuItem: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            connectionStatus: {
                color: 'red',
            }
        };

        if (this.props.connectionStatus === false) {
            style.connectionStatus.color = 'green';
        }
        if (this.props.connectionStatus) {
            style.connectionStatus.color = 'red';
        }

        return (
            <div>
                <Navbar inverse fluid style={style.headerStyle}>

                    <Navbar.Header>
                        <Navbar.Brand style={style.logo}>
                            Code Pad
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <ButtonToolbar style={style.buttonToolbar}>
                                <SplitButton bsStyle="default" bsSize="small" title={[<Glyphicon glyph="file"/>, " New"]} onClick={this.new}>
                                </SplitButton>
                                <Button bsStyle="default" bsSize="small" onClick={this.open} ><Glyphicon glyph="folder-open"/>  Open</Button>
                                <Button bsStyle="default" bsSize="small" onClick={this.props.showSaveModal} ><Glyphicon glyph="floppy-disk"/> Save</Button>
                                <DropdownButton bsStyle="default" bsSize="small" title={[<Glyphicon glyph="share"/>, " Share"]}>
                                    <MenuItem disabled={this.props.connectionStatus === false} eventKey={2.3} onSelect={this.goOnline}>
                                        Start Streaming Editor
                                    </MenuItem>
                                    <MenuItem disabled={this.props.connectionStatus !== false} eventKey={2.2} onSelect={this.goOffline}>
                                        Stop Streaming Editor
                                    </MenuItem>
                                    <MenuItem eventKey={2.4} onSelect={this.startTogetherJS}>
                                        Toggle Real Time Collaboration
                                    </MenuItem>
                                </DropdownButton>
                            </ButtonToolbar>
                        </Nav>

                        <Nav pullRight>
                            <Navbar.Text style={style.connectionStatus}>{<Glyphicon glyph="user" />}</Navbar.Text>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        books: state.books
    };
}
/**
 * Anything returned from this function will end up as props
 * dispatch takes all actions and makes sure they are passed to all the reducers
 */
function mapDispatchToProps(dispatch) {
    // when selectBook is called, result should be passed to reducers
    return bindActionCreators({
        newProject: newProject,
        showOpenModal: showOpenModal,
        showSaveModal: showSaveModal
    },
        dispatch)
}
// produces a container (is aware of state)
// promote booklist to container - needs to know about dispatch method
export default connect(mapStateToProps, mapDispatchToProps)(Header);

                            // <NavDropdown eventKey={1} title="File" id="basic-nav-dropdown">
                            //     <MenuItem eventKey={1.1} onSelect={this.new}>New</MenuItem>
                            //     <MenuItem eventKey={1.2} onSelect={this.open}>Open</MenuItem>
                            //     <MenuItem eventKey={1.3} onSelect={this.props.showSaveModal}>Save</MenuItem>
                            //     <MenuItem eventKey={1.4} onSelect={this.fork}>Fork</MenuItem>
                            // </NavDropdown>
                            // <NavDropdown style={style.menuItem} eventKey={2} title="Share" id="basic-nav-dropdown">
                            //     <MenuItem disabled={this.props.connectionStatus === false} eventKey={2.3} onSelect={this.goOnline}>
                            //         Start Streaming Editor
                            //     </MenuItem>
                            //     <MenuItem disabled={this.props.connectionStatus !== false} eventKey={2.2} onSelect={this.goOffline}>
                            //         Stop Streaming Editor
                            //     </MenuItem>
                            //     <MenuItem eventKey={2.4} onSelect={this.startTogetherJS}>
                            //         Toggle Real Time Collaboration
                            //     </MenuItem>
                            // </NavDropdown>
