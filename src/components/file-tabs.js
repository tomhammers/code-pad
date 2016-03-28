import React, { Component } from 'react';
import { Col, ListGroup, ListGroupItem } from 'react-bootstrap';

export default class LeftSidebar extends Component {

    renderList() {

        return this.props.fileNames.map((fileName) => {
            let style = {
                paddingLeft: '15px',
                marginTop: '5px',
                color: '#9d9d9d',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: ''
            };
            if (this.props.activeFile === fileName.fileName) {
                style.backgroundColor = "#152B39"
            } else {
                style.backgroundColor = ""
            }
            return (
                <li
                    style={style}
                    key={fileName.fileName}
                    onClick={ () => this.props.onSelectFile(fileName.fileName) }
                    className="active filesHover"
                >
                    {fileName.fileName}
                </li>

            );
        });
    }


    render() {
        let style = {
            outer: {
                paddingRight: '0',
                color: '#FFFFFF'
            },
            projectHeader: {
                paddingLeft: '1px'
            },
            folder: {
                paddingRight: '10px',
                paddingLeft: '5px'
            }
        };

        return (
            <Col lg={1} style={style.outer}>
                <div>
                    <ul>
                        {this.renderList()}
                    </ul>
                </div>

            </Col>
        );
    }
}


