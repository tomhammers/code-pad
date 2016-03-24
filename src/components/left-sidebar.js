import React, { Component } from 'react';
import { Col, Glyphicon } from 'react-bootstrap';

export default class LeftSidebar extends Component {

    renderList() {
        let style = {
            paddingLeft: '3px',
            paddingTop: '5px',
            whiteSpace: 'nowrap'
        };
        return this.props.fileNames.map((fileName) => {
            return (
                <li
                    style={style}
                    key={fileName}
                    onClick={ () => this.props.onSelectFile(fileName) }
                >
                    <Glyphicon glyph="file"/>
                    {fileName}
                </li>
            );
        });
    }


    render() {
        let style = {
            outer: {
                paddingRight: '0',
                color: '#9d9d9d'
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


