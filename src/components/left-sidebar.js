import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

export default class LeftSidebar extends Component {

    render() {
        return (
            <Col md={1} style={style}>
                Files
            </Col>
        );
    }
}

let style = {
    borderRight: '2px solid grey',
    height: '100%'
};