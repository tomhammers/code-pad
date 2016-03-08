import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class BSButton extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.whenClicked();
    }

    render() {
        return (
            <Button
                style={buttonStyle}
                onClick={this.handleClick}
                type="button"
                bsStyle="primary"
            >{this.props.buttonTitle}</Button>
        );
    }
}

let buttonStyle = {
  margin: 2
};