import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
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
            <Row style={style.headerStyle}>

                <Col md={10}>
                    <h3 style={style.logo}>{this.props.title}</h3>
                    <Button whenClicked={this.whenSaved} buttonTitle='Save'/>
                    <Button whenClicked={this.new} buttonTitle='New'/>
                    <Button whenClicked={this.load} buttonTitle='Open'/>
                </Col>
                <Col md={2}>
                    Settings | Sign-In
                </Col>
            </Row>

        );
    }
}

Header.propTypes = {
    title: React.PropTypes.string.isRequired
};

let style = {
    headerStyle: {
        borderBottom: '4px solid grey',
        paddingBottom: '3px'
    },
    logo: {
        padding: '10px',
        paddingTop: 0,
        margin: 0
    }
};
