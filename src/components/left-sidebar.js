import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

export default class LeftSidebar extends Component {



    render() {

        let style = {
            borderRight: '2px solid grey',
            minHeight: '100%'
        };

        return (
            <Col md={1} style={style}>
                Files
            </Col>
        );
    }
}

