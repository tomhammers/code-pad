var React = require('react');
var io = require('socket.io-client');
var Header = require('./parts/header');

var App = React.createClass({

    getInitialState() {
        return {
            title: 'Code-Pad'
        }
    },

    componentWillMount() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect);
        this.socket.on('disconnect', this.disconnect);
        this.socket.on('welcome', this.welcome);
    },

    connect() {
        console.log('Connected! ' + this.socket.id);
    },

    disconnect() {
    },

    welcome(serverState) {
    },

    render() {
        return (
            <div>
                <Header title={this.state.title}/>
            </div>
        );
    }
});

module.exports = App;