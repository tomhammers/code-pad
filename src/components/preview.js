import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


class Preview extends Component {

    constructor(props) {
        super(props);

        // will hold the files in correct order
        this.htmlfiles = [];
        this.cssfiles = [];
        this.jsfiles = [];
    }

    componentDidMount() {
        this.sandbox = this.refs.iframe;
    }

    componentDidUpdate() {
        this.populateSandbox();
    }

    populateSandbox() {
        for (let i = 0, l = this.props.files.length; i < l; i++) {
            if (this.props.files[i].fileType === 'html') {
                this.htmlfiles.push(this.props.files[i].content);
            }
            if (this.props.files[i].fileType === 'css') {
                this.cssfiles.push(this.props.files[i].content);
            }
            if (this.props.files[i].fileType === 'javascript') {
                this.jsfiles.push(this.props.files[i].content);
            }
        }

        let doc = this.sandbox.contentWindow.document;
        doc.open();
        for (let i = 0, l = this.htmlfiles.length; i < l; i++) {
            doc.write(this.htmlfiles[i])
        }
        for (let i = 0, l = this.cssfiles.length; i < l; i++) {
            doc.write(`<style type=\"text/css\">${this.cssfiles[i]}</style>`);
        }
        for (let i = 0, l = this.jsfiles.length; i < l; i++) {
            doc.write(`<script>${this.jsfiles[i]}</script>`);
        }

        doc.close();

        this.htmlfiles = [];
        this.cssfiles = [];
        this.jsfiles = [];
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
            <Col lg={12} style={style.iframeParent}>
                <iframe ref="iframe" style={style.iframeStyle}>
                </iframe>
            </Col>
        );
    }
}

// applications state to props, look in reducer/index; files will be found there
function mapStateToProps(state) {
    return {
        files: state.files,
    };
}

function mapDispatchToProps(dispatch) {
    // when selectBook is called, result should be passed to reducers
    return bindActionCreators({ }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);