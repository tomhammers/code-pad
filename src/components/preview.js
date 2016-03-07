import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
                <iframe ref="iframe"className="col-md-6">
                </iframe>
        );
    }
}

