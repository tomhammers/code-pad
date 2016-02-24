import React, { Component } from 'react';
import io from 'socket.io-client';
import pdb from 'pouchdb';

import Header from './header';
import LeftSidebar from './left-sidebar';
import Pad from './pad';
import Preview from './preview';

let socket = io('http://localhost:3000');

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Code-Pad',
            initialCode: "<html><body></body></html>",
            code: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        socket.on('connect', this.connect);
        socket.on('disconnect', this.disconnect);
        socket.on('welcome', this.welcome);
    }

    connect() {
        console.log('Connected! ' + socket.id);
    }

    disconnect() {
    }

    welcome(serverState) {
    }

    handleChange(value) {
        this.setState({code: value});
    }

    render() {
        return (
            <div className="fill">
                <Header className="header" title={this.state.title}/>
                <div className="row fill" >
                    <LeftSidebar />
                    <Pad
                        onChange={this.handleChange}
                        initialCode={this.state.initialCode}
                        code={this.state.code}
                    />
                    <Preview
                        code={this.state.code}
                    />
                </div>
            </div>
        );
    }

}