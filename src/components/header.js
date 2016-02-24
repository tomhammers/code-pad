import React, { Component } from 'react';

export default class Header extends Component {

    render() {
        return (
            <header className="row">
                <div className="col-sm-9">
                    <h3 id="logo">{this.props.title}</h3>
                </div>
                <div className="col-sm-3">
                    Settings | Sign-In
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    title: React.PropTypes.string.isRequired
};
