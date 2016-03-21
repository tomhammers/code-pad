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

        let style = {
            iframeStyle: {
                height: this.props.height - 5,
                width: '100%',
                border: '0'
            },
            iframeParent: {
                paddingRight: 0,
                paddingLeft: 0
            }
        };

        return (
            <Col sm={6} style={style.iframeParent}>
                <iframe ref="iframe" style={style.iframeStyle}>
                </iframe>
            </Col>
        );
    }
}

