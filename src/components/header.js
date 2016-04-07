import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap';

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.whenSaved = this.whenSaved.bind(this);
        this.new = this.new.bind(this);
        this.load = this.load.bind(this);
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

    render() {
        let style = {
            headerStyle: {
                border: 0,
                backgroundColor: '#363636',
                borderBottom: '1px solid black',
                color: '#BABABB'
            },
            logo: {
                padding: '10px',
                paddingTop: 0,
                margin: 0
            },
            menuItem: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            connectionStatus: {
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                background: 'red'
            }
        };

        return (
            <Navbar inverse fluid style={style.headerStyle}>

                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown style={style.menuItem} eventKey={1} title="File" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1} onSelect={this.new}>New</MenuItem>
                            <MenuItem eventKey={1.2} onSelect={this.load}>Open</MenuItem>
                            <MenuItem eventKey={1.3} onSelect={this.whenSaved}>Save As</MenuItem>
                            <MenuItem eventKey={1.4}>Fork</MenuItem>
                            <MenuItem eventKey={1.5}>Rename</MenuItem>
                            <MenuItem eventKey={1.6}>Delete</MenuItem>
                            <MenuItem eventKey={1.6}>Download</MenuItem>
                        </NavDropdown>
                        <NavDropdown style={style.menuItem}eventKey={2} title="Collaboration" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.1}>Share</MenuItem>
                            <MenuItem eventKey={2.2}>Go offline</MenuItem>
                        </NavDropdown>
                        <NavDropdown style={style.menuItem}eventKey={3} title="Settings" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1}>Editor Settings</MenuItem>
                            <MenuItem eventKey={3.2}>Collaboration Settings</MenuItem>
                            <MenuItem eventKey={3.3}>User Settings</MenuItem>
                        </NavDropdown>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={4} href="#"><Button bsStyle="primary">Sign In</Button></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

Header.defaultProps = {
    connected: 'false'
};

Header.propTypes = {
    title: React.PropTypes.string.isRequired
};


//<Navbar.Header>
//    <Navbar.Brand>
//        Code-Pad
//    </Navbar.Brand>
//    <Navbar.Toggle />
//</Navbar.Header>



