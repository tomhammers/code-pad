import React, { Component } from 'react';
import Ace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/theme/dreamweaver';

function onChange(newValue) {
    console.log('change', newValue);
}

export default class Pad extends Component {

    constructor(props) {
        super(props);
        // set initial state here, so code from database?
        this.state = {padContent: this.props.code};

        this.whenChanged = this.whenChanged.bind(this);
        this.whenCleared = this.whenCleared.bind(this);
    }

    // calls parent method
    whenChanged(value) {
        this.props.onChange('code', value);
    }

    //componentDidMount() {
    //    this.editor = Ace.edit('editor');
    //    this.editor.getSession().setMode('ace/mode/html');
    //    this.editor.setTheme('ace/theme/dawn');
    //    this.editor.getSession().doc.on('change', () => {
    //        let content = this.editor.getSession().getValue();
    //        this.whenChanged(content);
    //    });
    //    this.editor.getSession().setValue(this.props.code);
    //    this.editor.$blockScrolling = Infinity;
    //}


    whenCleared() {
        this.editor.getSession().setValue(this.props.code);
    }


    render() {
        return (
            <div className="col-md-5">
                <AceEditor
                    mode="html"
                    theme="dreamweaver"
                    onChange={this.whenChanged}
                    name="htmlPad"
                    editorProps={{$blockScrolling: true}}
                    value={this.props.code}
                    height="90vh"
                    fontSize={16}
                />
            </div>
        );
    }
}
