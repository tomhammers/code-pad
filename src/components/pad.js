import React, { Component } from 'react';
import Ace from 'brace';
import { Col } from 'react-bootstrap';

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
    }

    componentDidMount() {
        this.editor = Ace.edit('editor');
        this.editor.$blockScrolling = Infinity;
        this.editor.setFontSize(15);
        this.editor.getSession().setMode('ace/mode/html');
        this.editor.setTheme('ace/theme/tomorrow_night_eighties');
        this.editor.setShowPrintMargin(false);
        this.editor.getSession().setValue(this.props.code);
        this.editor.getSession().on('change', () => {
            this.whenChanged()
        });

    }

    componentWillReceiveProps(nextProps) {
        if (this.editor.getSession().getValue() !== nextProps.code) {
            // editor.setValue is a synchronous function call, change event is emitted before setValue return.
            this.silent = true;
            this.editor.setValue(nextProps.code, -1);
            this.silent = false;
        }
    }

    // calls parent method
    whenChanged() {
        if (this.props.onChange && !this.silent) {
            this.props.onChange('code', this.editor.getSession().getValue());
        }
    }

    render() {

        let style = {
            pad: {
                height: this.props.height,
                borderRight: 'thick solid #404040',
                borderLeft: 'thick solid #404040',
            },
            padParent: {
                height: this.props.height,
                paddingLeft: '2px',
                paddingRight: 0
            }
        };

        return (
            <Col sm={5} id="pad" style={style.padParent}>
                <div id="editor" style={style.pad}>
                </div>
            </Col>
        );
    }
}

