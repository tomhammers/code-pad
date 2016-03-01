import React, { Component } from 'react';
import Button from './button.js';


export default class Header extends Component {

    constructor(props) {
        super(props);

        this.whenSaved = this.whenSaved.bind(this);
        this.new = this.new.bind(this);
        this.load = this.load.bind(this);
    }

    whenSaved() {
        this.props.onSave();
    }

    new() {
        this.props.onNew();
    }

    load() {
        this.props.onOpen();
    }

    render() {
        return (
            <header className="row">
                <div className="col-sm-10">
                    <h3 id="logo">{this.props.title}</h3>
                    <Button whenClicked={this.whenSaved} buttonTitle='Save'/>
                    <Button whenClicked={this.new} buttonTitle='New'/>
                    <Button whenClicked={this.load} buttonTitle='Open'/>
                </div>
                <div className="col-sm-2 pull-right">
                    Settings | Sign-In
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    title: React.PropTypes.string.isRequired
};
