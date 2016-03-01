import React, { Component } from 'react';

export default class Button extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.whenClicked();
    }

    render() {
        return (
            <button
                style={buttonStyle}
                onClick={this.handleClick}
                type="button"
                className="btn btn-primary"
            >{this.props.buttonTitle}</button>
        );
    }
}

let buttonStyle = {
  margin: 2
};