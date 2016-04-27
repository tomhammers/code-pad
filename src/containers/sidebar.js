import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectFile } from '../actions/index';
import { bindActionCreators } from 'redux';
import { Col, ListGroup, ListGroupItem } from 'react-bootstrap';

class LeftSidebar extends Component {

    renderFileList() {
        return this.props.files.map((file) => {
            let style = {
                paddingLeft: '5px',
                paddingTop: '3px',
                color: '#9d9d9d',
                fontSize: '13px',
                cursor: 'pointer',
                backgroundColor: ''
            };
            if (this.props.activeFile === file.fileName) {
                style.backgroundColor = "#152B39"
            } else {
                style.backgroundColor = ""
            }
            return (
                <li
                    style={style}
                    key={file.fileName}
                    onClick={ () => this.props.selectFile(file.fileName) }
                    className="active filesHover"
                    >
                    {file.fileName}
                </li>
            );
        });
    }

    render() {
        let style = {
            outer: {
                paddingRight: '0',
                color: '#FFFFFF'
            }
        };

        return (
            <Col lg={1} style={style.outer}>
                <div>
                    <ul>
                        {this.renderFileList() }
                    </ul>
                </div>

            </Col>
        );
    }
}

// applications state to props, look in reducer/index; files will be found there
function mapStateToProps(state) {
    return {
        files: state.files,
        activeFile: state.activeFile
    };
}
/**
 * Anything returned from this function will end up as props
 * dispatch takes all actions and makes sure they are passed to all the reducers
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ selectFile: selectFile }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);