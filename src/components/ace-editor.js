import Ace from 'brace';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/theme/dawn';

export default class AceEditor {
    constructor(domNode, initialCode) {
        this.setUpEditor(domNode, initialCode);
    }

    setUpEditor(domNode, initialCode) {
        this.editor = Ace.edit(domNode);
        this.editor.getSession().setMode('ace/mode/html');
        this.editor.setTheme('ace/theme/dawn');
        this.editor.getSession().setValue(initialCode);
        this.editor.$blockScrolling = Infinity;
        this.editor.getSession().doc.on('change', () => {
            let content = editor.getSession().getValue();
            whenChanged(content);
        });
    }


    onChange() {
        this.editor.getSession().doc.on('change', () => {
            let content = editor.getSession().getValue();
            whenChanged(content);
        });
    }


        //editor.getSession().doc.on('change', () => {
        //    let content = editor.getSession().getValue();
        //    whenChanged(content);
        //});


}
