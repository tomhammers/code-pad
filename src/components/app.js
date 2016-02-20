import React, { Component } from 'react';
import io from 'socket.io-client';

import Header from './../containers/header';
import LeftSidebar from './../containers/left-sidebar';
import Pad from './../containers/pad';
import Preview from './../containers/preview';

let socket = io('http://localhost:3000');

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Code-Pad'
        };
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

    render() {
        return (
            <div>
                <Header title={this.state.title}/>
                <div className="row">
                    <LeftSidebar />
                    <Pad />
                    <Preview />
                </div>
            </div>
        );
    }

}