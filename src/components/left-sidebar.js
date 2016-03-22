import React, { Component } from 'react';
import { Col, Glyphicon } from 'react-bootstrap';

export default class LeftSidebar extends Component {


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
            },
            file: {
                paddingLeft: '15px'
            },
            listItems: {
                whiteSpace: 'nowrap'
            }
        };

        return (
            <Col sm={1} style={style.outer}>
                <div>
                    <span style={style.projectHeader}>
                        <Glyphicon style={style.folder} glyph="folder-open"/>
                        <b>Project</b>
                    </span>
                </div>

                <div>
                    <ul>
                        <li
                            onClick={ () => this.props.onSelectFile() }
                            style={style.listItems}
                        >
                            <Glyphicon style={style.file} glyph="file"/>
                            index.html
                        </li>
                        <li
                            onClick={ () => this.props.onSelectFile() }
                            style={style.listItems}
                        >
                            <Glyphicon style={style.file} glyph="file"/>
                            script.js
                        </li>
                        <li
                            onClick={ () => this.props.onSelectFile() }
                            style={style.listItems}
                        >
                            <Glyphicon style={style.file} glyph="file"/>
                            style.css
                        </li>
                    </ul>
                </div>

            </Col>
        );
    }
}

