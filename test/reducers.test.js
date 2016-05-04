import { expect } from 'chai';
import reducer_active_file from '../src/reducers/reducer_active_file';
import reducer_active_line from '../src/reducers/reducer_active_line';
import reducer_available_editor_options from '../src/reducers/reducer_available_editor_options';
import reducer_cursor_position from '../src/reducers/reducer_cursor_position';
import reducer_diff_modal from '../src/reducers/reducer_diff_modal';
import reducer_editor_settings from '../src/reducers/reducer_editor_settings';
import reducer_files from '../src/reducers/reducer_files';


describe('Active File Reducer', () => {
    let state;

    beforeEach(() => {
        state = "index.html"
    });
    it('should return initial state', () => {
        expect(reducer_active_file(undefined, {})).to.eql(state);
    });
    it('should change active file to script.js', () => {
        let action = {
            type: 'FILE_SELECTED',
            payload: 'script.js'
        }
        let result = reducer_active_file(undefined, action);
        expect(result).to.eql('script.js');
    });
});

describe('Active Line Reducer', () => {
    let state;

    beforeEach(() => {
        state = true
    });
    it('should return initial state', () => {
        expect(reducer_active_line(undefined, {})).to.eql(state);
    });
    it('should change active line to false', () => {

        let action = {
            type: 'TOGGLE_ACTIVE_LINE',
            payload: false
        }
        let result = reducer_active_line(undefined, action);
        expect(result).to.eql(false)
    });
});

describe('Available Editor Options Reducer', () => {
    let state;
    beforeEach(() => {
        state = {
            theme: [
                {
                    name: 'tomorrow',
                    link: 'brace/theme/tomorrow'
                },
                {
                    name: 'tomorrow night eighties',
                    link: 'brace/theme/tomorrow_night_eighties'
                }
            ],
            fontSize: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        }
    });
    it('should return initial state', () => {
        expect(reducer_available_editor_options(undefined, {})).to.eql(state);
    });
});

describe('Cursor Position Reducer', () => {
    let state;

    beforeEach(() => {
        state = { row: 0, column: 0 }
    });
    it('should return initial state', () => {
        expect(reducer_cursor_position(undefined, {})).to.eql(state);
    });
    it('should update cursor position', () => {

        let action = {
            type: 'UPDATE_CURSOR',
            payload: { row: 2, column: 12 }
        }
        let result = reducer_cursor_position(undefined, action);
        expect(result).to.eql({ row: 2, column: 12 })
    });
});

describe('Diff Modal Reducer', () => {
    let state;

    beforeEach(() => {
        state = false
    });
    it('should return initial state', () => {
        expect(reducer_diff_modal(undefined, {})).to.eql(state);
    });
    it('should show diff modal', () => {
        let action = {
            type: 'SHOW_DIFF_MODAL',
            payload: true
        }
        let result = reducer_diff_modal(undefined, action);
        expect(result).to.eql(true)
    });
    it('should close diff modal on UPDATE_CODE action', () => {
        let action = {
            type: 'UPDATE_CODE',
            payload: false
        }
        let result = reducer_diff_modal(undefined, action);
        expect(result).to.eql(false)
    });
    it('should close diff modal on GO_ONLINE action', () => {
        let action = {
            type: 'GO_ONLINE',
            payload: false
        }
        let result = reducer_diff_modal(undefined, action);
        expect(result).to.eql(false)
    });
});

describe('Editor Settings Reducer', () => {
    let state;

    beforeEach(() => {
        state = {
            theme: 'ace/theme/tomorrow_night_eighties',
            fontSize: 14
        }
    });
    it('should return initial state', () => {
        expect(reducer_editor_settings(undefined, {})).to.eql(state);
    });
    it('should update the font size', () => {
        let action = {
            type: 'UPDATE_FONT_SIZE',
            payload: 20
        }
        var newSettings = Object.assign({}, state);
        newSettings.fontSize = action.payload;
        expect(reducer_editor_settings(undefined, newSettings)).to.deep.eql(state);
    })
});

describe('Files Settings Reducer', () => {
    let state;

    beforeEach(() => {
        state = [
            {
                fileName: "index.html",
                fileType: "html",
                content: "<html>\n    <head>\n    </head>\n    <body>\n        <h2><center>Welcome to Code Pad</center></h2>\n    </body>\n</html>"
            },
            {
                fileName: "script.js",
                fileType: "javascript",
                content: "console.log('hello world');"
            },
            {
                fileName: "style.css",
                fileType: "css",
                content: "body {\n    background-color: #363636;\n    color: #f9f7f7;\n    font-family: Tahoma, Geneva, sans-serif;\n}"
            }
        ]
    });
    it('should return initial state', () => {
        expect(reducer_files(undefined, {})).to.eql(state);
    });
    it('should update code in files on CODE_CHANGED', () => {
        let action = {
            type: 'CODE_CHANGED',
            payload: 20
        }
        expect(reducer_files(undefined, action)).to.eql(state);
    })
});