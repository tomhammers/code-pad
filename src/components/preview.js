import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Col } from 'react-bootstrap';

export default class Preview extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.sandbox = this.refs.iframe;
    }

    componentDidUpdate() {
        this.populateSandbox();
    }

    populateSandbox() {
        this.sandbox.contentWindow.document.open();
        this.sandbox.contentWindow.document.write(this.props.code);
        this.sandbox.contentWindow.document.close();
    }

    render() {
        return (
            <Col md={6}>
                <iframe ref="iframe" style={style}>
                </iframe>
            </Col>
        );
    }
}

let style = {
    width: '100%',
    height: '90vh',
    borderTop: 0
};