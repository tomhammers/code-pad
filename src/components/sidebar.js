import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFile, selectFile } from '../actions/index';
import { bindActionCreators } from 'redux';
import { Button, Col, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';

class LeftSidebar extends Component {
    
    handleAddFileButtonClick() {
        var filePrompt = prompt("Enter FileName");
        console.log(filePrompt);   
        if(filePrompt.endsWith('.js')) {
            this.props.addFile(filePrompt, 'javascript');
        }
        else if (filePrompt.endsWith('.css')) {
            this.props.addFile(filePrompt, 'css');
        } else {
            alert("Sorry, only file extensions .js and .css are supported at this time, we are working on it!");
        }
    }

    renderFileList() {
        return this.props.files.map((file) => {
            let style = {
                paddingLeft: '5px',
                color: '#BABABB',
                fontSize: '13px',
                cursor: 'pointer',
                backgroundColor: '#363636',
                border: "none",
                paddingRight: '5px'
            };
            let closeButton = {
                float: 'right',
                textAlign: 'right',
                backgroundColor: '#363636'
            }
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
                    <Glyphicon style={closeButton} glyph="remove"/>
                </ListGroupItem>
            );
        });
    }

    render() {
        let style = {
            outer: {
                paddingRight: '0',
                color: '#FFFFFF'
            },
            button: {
                marginLeft: '5px',
                color: 'black'
            }
        };

        return (
            <Col lg={1} style={style.outer}>
                <div>
                    <ListGroup>
                        {this.renderFileList() }
                    </ListGroup>
                    <Button
                        bsStyle="success"
                        bsSize="small"
                        style={style.button}
                        onClick={this.handleAddFileButtonClick.bind(this) }
                        >
                        Add File
                    </Button>
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
    return bindActionCreators({ addFile: addFile, selectFile: selectFile }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);