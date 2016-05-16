import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button, ButtonToolbar, DropdownButton, SplitButton, Glyphicon } from 'react-bootstrap';

class Header extends Component {

    render() {

        let style = {
            beta: {
                color: "black",
                fontSize: "10px"
            },
            buttonToolbar: {
                paddingTop: "10px"
            },
            glyphs: {
                color: "grey"
            },
            headerStyle: {
                border: 0
                //borderBottom: '1px solid black',
            },
            logo: {
                paddingLeft: "5px",
                paddingTop: "5px",
                paddingBottom: 0
            },
            menuItem: {
                paddingLeft: '5px',
                paddingRight: '5px'
            },
            connectionStatus: {
                color: 'red',
                marginTop: "5px",
                marginBottom: 0
            }
        };

        if (this.props.offlineMode === false) {
            style.connectionStatus.color = 'green';
        }
        if (this.props.offlineMode) {
            style.connectionStatus.color = 'red';
        }

        return (
            <Navbar fluid style={style.headerStyle}>

                <Navbar.Header>
                    <Navbar.Brand style={style.logo}>
                        <Glyphicon glyph="link" /> Code Pad
                        <span style={style.beta}> BETA</span>
                    </Navbar.Brand>
                </Navbar.Header>


                <Nav pullRight>
                    <Navbar.Text style={style.connectionStatus}>{<Glyphicon glyph="user" />}</Navbar.Text>
                </Nav>
            </Navbar>
        );
    }
}

function mapStateToProps(state) {

    return {
        offlineMode: state.offlineMode,
    };
}

export default connect(mapStateToProps)(Header);
