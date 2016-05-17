import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { codeChange, updateCursor } from '../actions/index';

import Ace from 'brace';
Ace.config.set('basePath', '/libs/ace');
import { Col } from 'react-bootstrap';
import ToggleDisplay from'react-toggle-display';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';

import 'brace/theme/tomorrow';
import 'brace/theme/tomorrow_night_eighties';

class Pad extends Component {
    constructor(props) {
        super(props);
        this.pads = [];
    }

    /**
    * Set up the right amount of dom nodes for each file to hold a pad (each node needs a unique name)
    * This is updated on add and remove file
    */
    setUpDom(files) {
        let style = {
            pad: {
                height: this.props.height,

            }
        };
        return files.map((file) => {
            return (
                <ToggleDisplay key={file.fileName} show={this.props.activeFile === file.fileName}>
                    <div
                        key={file.fileName}
                        id={file.fileName}
                        style={style.pad}
                        >
                    </div>
                </ToggleDisplay>
            );
        });
    }

    /**
    * react lifecycle, editor will mount onto the dom after dom has loaded
    */
    componentDidMount() {
        // create a new pad for each file in the project
        for (let i = 0, l = this.props.files.length; i < l; i++) {
            this.pads[i] = Ace.edit(this.props.files[i].fileName);
            this.setupEditor(this.pads[i], this.props.files[i].fileType, this.props.files[i].content, this.props.files[i].fileName);
        }
    }

    /**
    * This will happen on Open Project or an incoming change from the server
    * @param nextProps
    */
    componentWillReceiveProps(nextProps) {
        // check for adding / removing files
        if (this.props.files.length !== nextProps.files.length) {
            this.pads = [];
            this.setUpDom(nextProps.files);
            setTimeout(() => {
                for (let i = 0, l = nextProps.files.length; i < l; i++) {
                    this.pads[i] = Ace.edit(nextProps.files[i].fileName);
                    this.setupEditor(this.pads[i], nextProps.files[i].fileType, nextProps.files[i].content, nextProps.files[i].fileName);
                }
            }, 1)

        }
        // loop through all pads, update them with latest props  
        // need a bit of time for the DOM to update, there is probably a better solution

        for (let i = 0, l = this.pads.length; i < l; i++) {
            this.pads[i].setFontSize(parseInt(nextProps.editorSettings.fontSize));
            this.pads[i].setHighlightActiveLine(nextProps.activeLine);
            this.pads[i].renderer.setShowGutter(nextProps.showGutter);
            // this.pads[i].setTheme(nextProps.editorSettings.theme);
            //setTimeout(() => {
                if (this.pads[i].getSession().getValue() !== nextProps.files[i].content) {
                    this.updateEditorContent(this.pads[i], nextProps.files[i].content, this.props.cursorPos);
                }
            //}, 1)
        }

    }

    /**
     * Updates editor content from external resource (local db or from server)
     * @param editor
     * @param code
     * @param cursor
     */
    updateEditorContent(editor, code, cursor) {
        this.silent = true;
        editor.setValue(code);
        console.log(this.props.cursorPos);
        editor.gotoLine(this.props.cursorPos.row + 1, this.props.cursorPos.column);
        //this.props.updateCursor(cursor);
        //this.props.codeChange(editor.getSession().getValue(), "", cursor);
        this.silent = false;
    }

    /**
    * Set up a new editor, pass in editor object, codeType string, and the actual code
    * @param editor
    * @param codeType
    * @param code
    */
    setupEditor(editor, codeType, code, fileName) {
        editor.$blockScrolling = Infinity;
        editor.setFontSize(this.props.editorSettings.fontSize);
        editor.setShowPrintMargin(false);
        editor.setHighlightActiveLine(this.props.activeLine);
        editor.setTheme(this.props.editorSettings.theme);
        editor.getSession().setMode(`ace/mode/${codeType}`);
        editor.getSession().setValue(code);
        // editor.getSession().on('change', () => {
        //     this.whenChanged(editor, fileName)
        // });
        editor.container.addEventListener('keyup', (e) => {
            this.whenChanged(editor, fileName);
        })
        editor.moveCursorToPosition(this.props.cursorPos);
    }

    /**
    * Will call parent method when user makes changes on editor, pass editor object and codetype string
    * @param editor
    * @param codeType
    */
    whenChanged(editor, fileName) {
        this.props.codeChange(editor.getSession().getValue(), fileName);
        this.props.updateCursor(editor.getCursorPosition());
        this.props.onChange(this.pads);
    }

    render() {
        let style = {
            padParent: {
                height: this.props.height + 5,
                borderRight: 'thin solid black',
                borderLeft: 'thin solid black',
                paddingLeft: '0px',
                paddingRight: 0
            }
        };

        return (
            <Col lg={7} id="pad" style={style.padParent}>
                {this.setUpDom(this.props.files) }
            </Col>
        );
    }
}

// applications state to props, look in reducer/index; files will be found there
function mapStateToProps(state) {
    return {
        activeLine: state.activeLine,
        cursorPos: state.cursorPos,
        files: state.files,
        activeFile: state.activeFile,
        editorSettings: state.editorSettings,
        showGutter: state.showGutter
    };
}
/**
 * Anything returned from this function will end up as props
 * dispatch takes all actions and makes sure they are passed to all the reducers
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ codeChange: codeChange, updateCursor: updateCursor }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(Pad);