import React, { Component } from 'react';
import Ace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/theme/dawn';



function onChange(newValue) {
    console.log('change', newValue);
}

export default class Pad extends Component {

    constructor(props) {
        super(props);
        // set initial state here, so code from database?
        //this.state = { term: '' };

        this.whenChanged = this.whenChanged.bind(this);
    }
    // calls parent method
    whenChanged(value) {
        this.props.onChange(value);
    }

    componentDidMount() {
        var editor = ace.edit('editor');
        editor.getSession().setMode('ace/mode/html');
        editor.setTheme('ace/theme/dawn');
        editor.getSession().doc.on('change', () => {
            let content = editor.getSession().getValue();
            this.whenChanged(content);
        });
        editor.getSession().setValue(this.props.initialCode);
        editor.$blockScrolling = Infinity;

    }


    render() {
        return (
            <div onChange={this.whenChanged} id="editor" className="col-md-5 full-height">
            </div>
        );
    }
}
