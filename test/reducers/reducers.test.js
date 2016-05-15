import { expect }                           from 'chai';
import reducer_active_file                  from '../../src/reducers/reducer_active_file';
import reducer_active_line                  from '../../src/reducers/reducer_active_line';
import reducer_available_editor_options     from '../../src/reducers/reducer_available_editor_options';
import reducer_cursor_position              from '../../src/reducers/reducer_cursor_position';
import reducer_diff_modal                   from '../../src/reducers/reducer_diff_modal';
import reducer_editor_settings              from '../../src/reducers/reducer_editor_settings';
import reducer_editor_stream                from '../../src/reducers/reducer_editor_stream';
import reducer_files                        from '../../src/reducers/reducer_files';
import reducer_offline_mode                 from '../../src/reducers/reducer_offline_mode';
import reducer_open_modal                   from '../../src/reducers/reducer_open_modal';
import reducer_open_server_projects_modal   from '../../src/reducers/reducer_open_server_projects_modal';
import reducer_project_id                   from '../../src/reducers/reducer_project_id';
import reducer_project_name                 from '../../src/reducers/reducer_project_name';
import reducer_save_modal                   from '../../src/reducers/reducer_save_modal';
import reducer_show_gutter                  from '../../src/reducers/reducer_show_gutter';

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
    it('should return a blank active file on DELETE_FILE action', () => {
        let action = {
            type: 'DELETE_FILE'
        }
        let result = reducer_active_file(undefined, action);
        expect(result).to.eql('');
    })
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

describe('Editor Stream Reducer', () => {
    let state;

    beforeEach(() => {
        state = false
    });
    it('should return initial state', () => {
        expect(reducer_editor_stream(undefined, {})).to.eql(state);
    });
    it('should start the streaming editor', () => {
        let action = {
            type: 'START_STREAMING_EDITOR'
        }
        expect(reducer_editor_stream(undefined, action)).to.deep.eql(true);
    });
    it('should stop the streaming editor', () => {
        let action = {
            type: 'STOP_STREAMING_EDITOR'
        }
        expect(reducer_editor_stream(undefined, action)).to.deep.eql(false);
    });
});

describe('Files Reducer', () => {
    let state;

    beforeEach(() => {
        state = [
            {
                fileName: "index.html",
                fileType: "html",
                content: "<html>\n    <head>\n        <link rel=\"stylesheet\" href=\"style.css\">\n    </head>\n    <body>\n        <h1><center>Welcome to Code Pad</center></h1>\n        <script src=\"script.js\"></script>\n    </body>\n</html>"
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
    it('should add a file to the files array', () => {
        let files = JSON.parse(JSON.stringify(state));
        let newFile = {
            fileName: "main.js",
            fileType: "javascript",
            content: ""
        };
        state.push(newFile);
        let action = {
            type: 'ADD_FILE',
            payload: ["main.js", "javascript"]
        }
        expect(reducer_files(undefined, action)).to.eql(state);
    });
    it('should update code in files on CODE_CHANGED', () => {
        let action = {
            type: 'CODE_CHANGED',
            payload: 20
        }
        expect(reducer_files(undefined, action)).to.eql(state);
    });
    it('should delete a file in the files array', () => {
        state.splice(1, 1);
        let action = {
            type: 'DELETE_FILE',
            payload: 'script.js'
        }
        expect(reducer_files(undefined, action)).to.eql(state);
    });
    it('should update the files on UPDATE_CODE action', () => {
        let action = {
            type: 'UPDATE_CODE',
            payload: [state, ""]
        }
        expect(reducer_files(undefined, action)).to.eql(state);
    });
    it('should reset files back to default on NEW_PROJECT action', () => {
        let action = {
            type: 'NEW_PROJECT'
        }
        expect(reducer_files(undefined, action)).to.eql(state);
    });
});

describe('Offline Mode Reducer', () => {
    let state;
    beforeEach(() => {
        state = true
    });
    it('should go online', () => {
        let action = {
            type: 'GO_ONLINE'
        }
        expect(reducer_offline_mode(undefined, action)).to.eql(false);
    });
    it('should go offline', () => {
        let action = {
            type: 'GO_OFFLINE'
        }
        expect(reducer_offline_mode(undefined, action)).to.eql(true);
    });
});

describe('Show Open Modal Reducer', () => {
    let state;
    beforeEach(() => {
        state = false
    });
    it('should show the open modal', () => {
        let action = {
            type: 'SHOW_OPEN_MODAL'
        }
        expect(reducer_open_modal(undefined, action)).to.eql(true);
    });
});

describe('Show / Hide Open Server Projects Modal Reducer', () => {
    let state;
    beforeEach(() => {
        state = false
    });
    it('should show the open server projects modal', () => {
        let action = {
            type: 'SHOW_OPEN_SERVER_PROJECTS_MODAL'
        }
        expect(reducer_open_server_projects_modal(undefined, action)).to.eql(true);
    });
    it('should close the open server projects modal', () => {
        let action = {
            type: 'CLOSE_OPEN_SERVER_PROJECTS_MODAL'
        }
        expect(reducer_open_server_projects_modal(undefined, action)).to.eql(false);
    });
});

describe('Project ID Reducer', () => {
    let state;
    beforeEach(() => {
        state = "fG567HnjO9"
    });
    it('should set a new project id', () => {
        let action = {
            type: 'SET_PROJECT_ID',
            payload: "fG567HnjO9"
        }
        expect(reducer_project_id(undefined, action)).to.eql("fG567HnjO9");
    });
});

describe('Project Name Reducer', () => {
    let state;
    beforeEach(() => {
        state = ""
    });
    it('should set project name on SAVE_PROJECT action', () => {
        let action = {
            type: 'SAVE_PROJECT',
            payload: "My Project"
        }
        expect(reducer_project_name(undefined, action)).to.eql("My Project");
    });
    it('should set project name when project is updated from external source', () => {
        let action = {
            type: 'UPDATE_CODE',
            payload: [[], "My Project"]
        }
        expect(reducer_project_name(undefined, action)).to.eql("My Project");
    });
    it('should set a blank project name on NEW_PROJECT action', () => {
        let action = {
            type: 'NEW_PROJECT'
        }
        expect(reducer_project_name(undefined, action)).to.eql("");
    });
});

describe('Project Save Modal Reducer', () => {
    let state;
    beforeEach(() => {
        state = false
    });
    it('should show save modal on SHOW_SAVE_MODAL action', () => {
        let action = {
            type: 'SHOW_SAVE_MODAL'
        }
        expect(reducer_save_modal(undefined, action)).to.eql(true);
    });
    it('should hide save modal on SAVE_PROJECT action', () => {
        let action = {
            type: 'SAVE_PROJECT'
        }
        expect(reducer_save_modal(undefined, action)).to.eql(false);
    });
    it('should hide save modal on HIDE_SAVE_MODAL action', () => {
        let action = {
            type: 'HIDE_SAVE_MODAL'
        }
        expect(reducer_save_modal(undefined, action)).to.eql(false);
    });
});

describe('Toggle Gutter Reducer', () => {
    let state;
    beforeEach(() => {
        state = true
    });
    it('should toggle gutter on TOGGLE_GUTTER action', () => {
        let action = {
            type: 'TOGGLE_GUTTER',
            payload: false
        }
        expect(reducer_show_gutter(undefined, action)).to.eql(false);
    });

});