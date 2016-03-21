import React, { Component } from 'react';
import { Col, Glyphicon } from 'react-bootstrap';

export default class LeftSidebar extends Component {


    render() {
        let style = {
            outer: {
                paddingRight: '0',
                backgroundColor: '#404040'
            },
            projectHeader: {
                color: '#9d9d9d',
                paddingLeft: '3px'
            },
            chevron: {
                paddingRight: '10px'
            }
        };

        return (
            <Col sm={1} style={style.outer}>
                <div>
                    <span style={style.projectHeader}>
                        <Glyphicon style={style.chevron} glyph="folder-open"/>
                        <b>Project</b>
                    </span>
                </div>

                <div>
                    <ul>

                    </ul>
                </div>

            </Col>
        );
    }
}

