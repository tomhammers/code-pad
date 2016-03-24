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
        let css = '' +
            '<style type="text/css">' +
            this.props.cssCode +
            '</style>';
        let js = '' +
                '<script>' +
                this.props.jsCode +
                '</script>';
        let doc = this.sandbox.contentWindow.document;
        doc.open();
        doc.write(this.props.htmlCode);
        doc.write(css);
        doc.write(js);
        doc.close();
        console.log(doc);
    }

    render() {

        let style = {
            iframeStyle: {
                height: this.props.height,
                width: '100%',
                border: '0',
                background: 'white'
            },
            iframeParent: {
                paddingRight: 0,
                paddingLeft: 0
            }
        };

        return (
            <Col lg={6} style={style.iframeParent}>
                <iframe ref="iframe" style={style.iframeStyle}>
                </iframe>
            </Col>
        );
    }
}

