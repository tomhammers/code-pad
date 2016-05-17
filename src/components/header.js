import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavDropdown, Glyphicon } from 'react-bootstrap';

/**
 * a simple component for the logo and connection status icon
 */
class Header extends Component {

    render() {
        let style = {
            beta: {
                color: "black",
                fontSize: "10px"
            },
            headerStyle: {
                border: 0
            },
            logo: {
                paddingLeft: "5px",
                paddingTop: "5px",
                paddingBottom: 0
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
