import React, { Component } from 'react';
import { Col, Tabs, Tab, Glyphicon, Table, Button } from 'react-bootstrap';
import QRCode from 'qrcode-react';
import Libraries from './libraries.json';

export default class Hub extends Component {
    constructor(props) {
        super(props);
        
        this.libraries = Libraries.libraries;
    }
    
    handleLibraryButtonClick(index) {
        this.props.insertLibrary(index);
    }

    mapLibraries() {
        let style = {
            outer: {
                marginLeft: "5px",
                marginTop: "8px",
                fontSize: "12px"
            },
            button: {
                position: "absolute",
                left: "100px"
            }
        };
        return this.libraries.map((library, i) => {
            return (
                <div key={i} bsStyle="info" href="#link1" style={style.outer}>
                    {library.name + " "} 
                    <Button 
                        bsStyle="primary" 
                        bsSize="xsmall" 
                        style={style.button}
                        onClick={this.handleLibraryButtonClick.bind(this, i)}
                    >
                    Add
                    </Button>
                </div>
            );
        });
    }

    render() {
        let style = {
            outer: {
                paddingLeft: "0px"
            },
            qrcode: {
                padding: "15px"
            },
            header: {
                marginLeft: "5px"
            }
        }
        return (
            <Col style={style.outer} lg={12}>
                <Tabs defaultActiveKey={1}>
                
                    <Tab eventKey={1} title={<Glyphicon glyph="book" />}>
                        <h4 style={style.header}>Add Libraries</h4>
                        <hr />
                        {this.mapLibraries() }
                    </Tab>
                    
                    <Tab eventKey={2} title={<Glyphicon glyph="comment" />}>
                        Project Chat
                    </Tab>
                    
                    <Tab eventKey={3} title={<Glyphicon glyph="cog" />}>
                        Editor Settings
                    </Tab>
                    
                    <Tab eventKey={4} title={<Glyphicon glyph="qrcode" />}>
                        <div style={style.qrcode}>
                            <p>Scan QR Code to collaborate on this project</p>
                            <QRCode
                                value={window.location.href}
                                size={192}
                                />
                        </div>
                    </Tab>
                    
                </Tabs>
            </Col>
        );
    }
}