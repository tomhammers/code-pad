import React from 'react';

var Header = React.createClass({

    propTypes: {
        title: React.PropTypes.string.isRequired
    },

    getDefaultProps() {
        return {
            status: 'disconnected'
        }
    },

    render() {
        return (
            <header className="row">
                <div className="col-xs-10">
                    <h1>{this.props.title}</h1>
                </div>
                <div className="col-xs-2">
                </div>

            </header>
        );
    }
});

module.exports = Header;