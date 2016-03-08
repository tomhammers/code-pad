import React, { Component } from 'react';
import { Grid, Row, Col, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import Button from './button.js';


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
                borderBottom: '4px solid grey',
                paddingBottom: '3px'
            },
            logo: {
                padding: '10px',
                paddingTop: 0,
                margin: 0
            },
            connectionStatus: {
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                background: 'red'
            }
        };

        return (


            <Navbar inverse fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        Code-Pad
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown eventKey={3} title="File" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1}>New</MenuItem>
                            <MenuItem eventKey={3.2}>Open</MenuItem>
                            <MenuItem eventKey={3.3}>Save</MenuItem>
                        </NavDropdown>
                        <NavItem eventKey={1} href="#">Link</NavItem>
                        <NavItem eventKey={2} href="#">Link</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">Settings</NavItem>
                        <NavItem eventKey={2} href="#">Sign In</NavItem>
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


//<Row style={style.headerStyle}>
//    <Col md={9}>
//        <h3 style={style.logo}>{this.props.title}</h3>
//        <Button whenClicked={this.whenSaved} buttonTitle='Save'/>
//        <Button whenClicked={this.new} buttonTitle='New'/>
//        <Button whenClicked={this.load} buttonTitle='Open'/>
//    </Col>
//    <Col md={2} pullRight>
//        Settings | Sign-In
//
//
//    </Col>
//    <Col md={1}>
//        <div style={style.connectionStatus}></div>
//    </Col>
//</Row>


