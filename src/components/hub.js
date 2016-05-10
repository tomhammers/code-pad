import React, { Component } from 'react';
import { Col, Tabs, Tab, Glyphicon, Button } from 'react-bootstrap';
import ChatBox from './chat-box';
import QRCode from 'qrcode-react';
import Libraries from '../libraries.json';
import Settings from './settings';


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
        fontSize: "12px",
        color: "#BABABB"
      },
      button: {
        position: "absolute",
        left: "100px"
      },
      text: {
        color: "#BABABB"
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
            onClick={this.handleLibraryButtonClick.bind(this, i) }
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
        paddingLeft: "0px",
        height: "100%"
      },
      qrcode: {
        padding: "15px"
      },
      header: {
        marginLeft: "5px",
        color: "#f9f7f7"
      },
      tab: {
        color: "#BABABB"
      }
    };
    return (
      <Col style={style.outer} lg={12}>
        <Tabs id={"2.3.4.5"} style={style.outer} defaultActiveKey={1}>

          <Tab key={1} eventKey={1} title={<Glyphicon glyph="book" />}>
            <h4 style={style.header}>Add Libraries</h4>
            <hr />
            {this.mapLibraries() }
          </Tab>

          <Tab key={2} eventKey={2} title={<Glyphicon glyph="cog" />}>
            <Settings />
          </Tab>

          <Tab key={3} eventKey={3} style={style.outer} title={<Glyphicon glyph="comment" />}>
            <ChatBox socket={this.props.socket} id={this.props.id}/>
          </Tab>

          <Tab key={4} eventKey={4} title={<Glyphicon glyph="qrcode" />}>
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