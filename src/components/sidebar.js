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
                color: '#BABABB',
                fontSize: '13px',
                cursor: 'pointer',
                backgroundColor: '#363636',
                border: "none"
            };
            if (this.props.activeFile === file.fileName) {
                style.backgroundColor = "#152B39"
            } else {
                style.backgroundColor = "#363636"
            }
            return (
                <ListGroupItem
                    style={style}
                    key={file.fileName}
                    onClick={ () => this.props.selectFile(file.fileName) }
                    className="active filesHover"
                    >
                    {file.fileName}
                </ListGroupItem>
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
                    <ListGroup>
                        {this.renderFileList() }
                    </ListGroup>
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