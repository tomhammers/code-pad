import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class Preview extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.populateSandbox();

    }

    componentDidUpdate() {
        this.populateSandbox();
    }

    populateSandbox() {
        var sandbox = this.refs.iframe;
        sandbox.contentWindow.document.open();
        sandbox.contentWindow.document.write(this.props.code);
        sandbox.contentWindow.document.close();
    }

    render() {
        return (
                <iframe ref="iframe"className="col-md-6 full-height">
                </iframe>
        );
    }
}

