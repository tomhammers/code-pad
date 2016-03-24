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
        // set initial state here, so code from database?
        this.state = {
            padContent: this.props.code,
            padHeight: 0
        };
        this.whenChanged = this.whenChanged.bind(this);
        this.setupEditor = this.setupEditor.bind(this);
        this.updateEditorContent = this.updateEditorContent.bind(this);
    }

    /**
     * react lifecycle, editor will mount onto the dom after dom has loaded
     */
    componentDidMount() {
        // Set up the html editor
        this.htmleditor = Ace.edit('html-editor');
        this.setupEditor(this.htmleditor, 'html', this.props.htmlCode);

        // Set up the js editor
        this.jseditor = Ace.edit('js-editor');
        this.setupEditor(this.jseditor, 'javascript', this.props.jsCode);

        // Set up the css editor
        this.csseditor = Ace.edit('css-editor');
        this.setupEditor(this.csseditor, 'css', this.props.cssCode);
    }

    /**
     * This will happen on Open Project or an incoming change from the server
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (this.htmleditor.getSession().getValue() !== nextProps.htmlCode) {
            this.updateEditorContent(this.htmleditor, nextProps.htmlCode);
        }
    }

    /**
     * Updates editor content from external resource (local db or from server)
     * @param editor
     * @param code
     */
    updateEditorContent(editor, code) {
        this.silent = true;
        editor.setValue(code, -1);
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
    }

    /**
     * Will call parent method when user makes changes on editor, pass editor object and codetype string
     * @param editor
     * @param codeType
     */
    whenChanged(editor, codeType) {
        if (this.props.onChange && !this.silent) {
            this.props.onChange(codeType, editor.getSession().getValue());
        }
    }

    render() {
        let style = {
            pad: {
                height: this.props.height,
                borderRight: 'thin solid #404040',
                borderLeft: 'thin solid #404040'
            },
            padParent: {
                height: this.props.height,
                paddingLeft: '2px',
                paddingRight: 0
            },
            hidden: {
                display: 'none'
            }
        };

        return (
            <Col lg={5} id="pad" style={style.padParent}>
                <ToggleDisplay show={this.props.activePad === 'index.html'}>
                    <div
                        id="html-editor"
                        style={style.pad}
                    >
                    </div>
                </ToggleDisplay>
                <ToggleDisplay show={this.props.activePad === 'script.js'}>
                    <div
                        id="js-editor"
                        style={style.pad}
                    >
                    </div>
                </ToggleDisplay>
                <ToggleDisplay show={this.props.activePad === 'style.css'}>
                    <div
                        id="css-editor"
                        style={style.pad}
                    >
                    </div>
                </ToggleDisplay>
            </Col>
        );
    }
}

