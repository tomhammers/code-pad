import React, { Component } from 'react';
import Ace from 'brace';
import { Col } from 'react-bootstrap';
import ToggleDisplay from'react-toggle-display';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/theme/tomorrow';
import 'brace/theme/tomorrow_night_eighties';

export default class Pad extends Component {

    constructor(props) {
        super(props);
        this.height = 0;
        this.pads = [];
        // set initial state here, so code from database?
        this.state = {
            padContent: this.props.code,
            padHeight: 0
        };
        this.whenChanged = this.whenChanged.bind(this);
        this.setupEditor = this.setupEditor.bind(this);
        this.updateEditorContent = this.updateEditorContent.bind(this);
        this.setUpDom = this.setUpDom.bind(this);
    }

    /**
     * Set up the right amount of dom nodes for each file to hold a pad (each node needs a unique name)
     */
    setUpDom() {
        let style = {
            pad: {
                height: this.props.height,
                borderRight: 'thin solid black',
                borderLeft: 'thin solid black'
            }
        };
        return this.props.code.files.map((file) => {
            return (
                <ToggleDisplay key={file.fileName} show={this.props.activePad === file.fileName}>
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
        for (let i = 0, l = this.props.code.files.length; i < l; i++) {
            this.pads[i] = Ace.edit(this.props.code.files[i].fileName);
            this.setupEditor(this.pads[i], this.props.code.files[i].fileType, this.props.code.files[i].content);
        }
    }

    /**
     * This will happen on Open Project or an incoming change from the server
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        // loop through all pads in project and update them if they are different
        for (let i = 0, l = this.pads.length; i < l; i++) {
            if (this.pads[i].getSession().getValue() !== nextProps.code.files[i].content) {
                this.updateEditorContent(this.pads[i], nextProps.code.files[i].content, nextProps.cursorPos);
            }
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
        editor.gotoLine(cursor.row + 1, cursor.column + 1);
        this.silent = false;
    }

    /**
     * Set up a new editor, pass in editor object, codeType string, and the actual code
     * @param editor
     * @param codeType
     * @param code
     */
    setupEditor(editor, codeType, code) {
        editor.$blockScrolling = Infinity;
        editor.setFontSize(14);
        editor.setTheme('ace/theme/tomorrow_night_eighties');
        editor.setShowPrintMargin(false);
        editor.getSession().setMode(`ace/mode/${codeType}`);
        editor.getSession().setValue(code);
        editor.getSession().on('change', () => {
            this.whenChanged(editor, codeType)
        });
        editor.moveCursorToPosition(this.props.cursorPos);
    }

    /**
     * Will call parent method when user makes changes on editor, pass editor object and codetype string
     * @param editor
     * @param codeType
     */
    whenChanged(editor, codeType) {
        if (this.props.onChange && !this.silent) {
            this.props.onChange(this.pads, editor.getCursorPosition());
        }
    }

    render() {
        let style = {
            padParent: {
                height: this.props.height,
                paddingLeft: '2px',
                paddingRight: 0
            }
        };

        return (
            <Col lg={5} id="pad" style={style.padParent}>
                {this.setUpDom()}
            </Col>
        );
    }
}