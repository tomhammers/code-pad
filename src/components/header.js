import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button, Tooltip, OverlayTrigger, DropdownMenu } from 'react-bootstrap';

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.whenSaved = this.whenSaved.bind(this);
        this.new = this.new.bind(this);
        this.load = this.load.bind(this);
        this.goOffline = this.goOffline.bind(this);
        this.goOnline = this.goOnline.bind(this);
        this.fork = this.fork.bind(this);
    }

    whenSaved() {
        this.props.onSave();
    }

    new() {
        this.props.onNew();
    }

    load() {
        this.props.onOpen();
    }

    fork() {
        this.props.fork();
    }

    goOffline() {
        this.props.goOffline();
    }

    goOnline() {
        this.props.goOnline();
    }

    render() {
        let style = {
            headerStyle: {
                border: 0,
                backgroundColor: '#363636',
                borderBottom: '1px solid black',
                color: '#BABABB'
            },
            logo: {},
            menuItem: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            connectionStatus: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                background: 'red',
                margin: '5px',
                marginTop: '15px'
            }
        };

        if (this.props.status === 'connected') {
            style.connectionStatus.background = 'green';
        }
        if (this.props.status === 'disconnected') {
            style.connectionStatus.background = 'red';
        }

        return (

            <Navbar inverse fluid style={style.headerStyle}>

                <Navbar.Header>
                    <Navbar.Brand style={style.logo}>
                        Express Code
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown style={style.menuItem} eventKey={1} title="File" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1} onSelect={this.new}>New</MenuItem>
                            <MenuItem eventKey={1.2} onSelect={this.load}>Open</MenuItem>
                            <MenuItem eventKey={1.3} onSelect={this.whenSaved}>Save</MenuItem>
                            <MenuItem eventKey={1.4} onSelect={this.fork}>Fork</MenuItem>
                        </NavDropdown>
                        <NavDropdown style={style.menuItem} eventKey={2} title="Share" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.1} onSelect={this.whenSaved}>
                                Share
                            </MenuItem>
                            <MenuItem disabled={this.props.connectionStatus !== false} eventKey={2.2} onSelect={this.goOffline}>
                                Go Offline
                            </MenuItem>
                            <MenuItem disabled={this.props.connectionStatus === false} eventKey={2.3} onSelect={this.goOnline}>
                                Go Online
                            </MenuItem>
                        </NavDropdown>
                        <NavDropdown style={style.menuItem} eventKey={3} title="Settings" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1}>Editor Settings</MenuItem>
                            <MenuItem eventKey={3.2}>Collaboration Settings</MenuItem>
                            <MenuItem eventKey={3.3}>User Settings</MenuItem>
                        </NavDropdown>
                    </Nav>

                    <Nav pullRight>
                        <Navbar.Text style={style.connectionStatus}></Navbar.Text>
                        <NavItem eventKey={4} href="#"><Button bsStyle="primary">Sign In</Button></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}






