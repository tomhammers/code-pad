import { expect } from 'chai';
import * as actions from '../../src/actions/index';

describe('Actions', () => {

    it('should create an ADD_FILE action', () => {
        const fileName = 'index.html';
        const fileType = 'html';
        const expectedAction = {
            type: 'ADD_FILE',
            payload: [fileName, fileType]
        };
        expect(actions.addFile(fileName, fileType)).to.eql(expectedAction);
    });

    it('should create a CLOSE_DIFF_MODAL action', () => {
        const expectedAction = {
            type: 'CLOSE_DIFF_MODAL'
        };
        expect(actions.closeDiffModal()).to.eql(expectedAction);
    });

    it('should create a CLOSE_OPEN_SERVER_PROJECTS_MODAL action', () => {
        const expectedAction = {
            type: 'CLOSE_OPEN_SERVER_PROJECTS_MODAL'
        };
        expect(actions.closeOpenServerProjectsModal()).to.eql(expectedAction);
    });

    it('should create a CODE_CHANGED action', () => {
        const code = "alert('Hello World')"
        const file = "script.js"

        const expectedAction = {
            type: 'CODE_CHANGED',
            payload: [code, file]
        };
        expect(actions.codeChange(code, file)).to.eql(expectedAction);
    });

    it('should create a DELETE_FILE action', () => {
        const fileName = 'index.html'
        const expectedAction = {
            type: 'DELETE_FILE',
            payload: fileName
        };
        expect(actions.deleteFile(fileName)).to.eql(expectedAction);
    });

    it('should create a FILE_SELECTED action', () => {
        const filename = "index.html"
        const expectedAction = {
            type: 'FILE_SELECTED',
            payload: filename
        };
        expect(actions.selectFile(filename)).to.eql(expectedAction);
    });

    it('should create a GENERATE_PROJECT_ID action', () => {
        const expectedAction = {
            type: 'GENERATE_PROJECT_ID'
        };
        expect(actions.generateProjectId()).to.eql(expectedAction);
    });

    it('should create a GO_ONLINE action', () => {
        const expectedAction = {
            type: 'GO_ONLINE'
        };
        expect(actions.goOnline()).to.eql(expectedAction);
    });

    it('should create a GO_OFFLINE action', () => {
        const expectedAction = {
            type: 'GO_OFFLINE'
        };
        expect(actions.goOffline()).to.eql(expectedAction);
    });

    it('should create a HIDE_SAVE_MODAL action', () => {
        const expectedAction = {
            type: 'HIDE_SAVE_MODAL'
        };
        expect(actions.closeSaveModal()).to.eql(expectedAction);
    });

    it('should create a NEW_PROJECT action', () => {
        const expectedAction = {
            type: 'NEW_PROJECT'
        };
        expect(actions.newProject()).to.eql(expectedAction);
    });

    it('should create a SAVE_PROJECT action', () => {
        const projName = "New Project"
        const expectedAction = {
            type: 'SAVE_PROJECT',
            payload: projName
        };
        expect(actions.saveProject(projName)).to.eql(expectedAction);
    });

    it('should create a SET_PROJECT_ID action', () => {
        const id = "f4dRt6Jl0Y"
        const expectedAction = {
            type: 'SET_PROJECT_ID',
            payload: id
        };
        expect(actions.setProjectId(id)).to.eql(expectedAction);
    });

    it('should create a SHOW_DIFF_MODAL action', () => {
        const expectedAction = {
            type: 'SHOW_DIFF_MODAL'
        };
        expect(actions.showDiffModal()).to.eql(expectedAction);
    });

    it('should create a SHOW_OPEN_MODAL action', () => {
        const expectedAction = {
            type: 'SHOW_OPEN_MODAL'
        };
        expect(actions.showOpenModal()).to.eql(expectedAction);
    });

    it('should create a SHOW_OPEN_SERVER_PROJECTS_MODAL action', () => {
        const expectedAction = {
            type: 'SHOW_OPEN_SERVER_PROJECTS_MODAL'
        };
        expect(actions.showOpenServerProjModal()).to.eql(expectedAction);
    });

    it('should create a SHOW_SAVE_MODAL action', () => {
        const expectedAction = {
            type: 'SHOW_SAVE_MODAL'
        };
        expect(actions.showSaveModal()).to.eql(expectedAction);
    });

    it('should create a START_STREAMING_EDITOR action', () => {
        const expectedAction = {
            type: 'START_STREAMING_EDITOR'
        };
        expect(actions.startStreamingEditor()).to.eql(expectedAction);
    });

    it('should create a STOP_STREAMING_EDITOR action', () => {
        const expectedAction = {
            type: 'STOP_STREAMING_EDITOR'
        };
        expect(actions.stopStreamingEditor()).to.eql(expectedAction);
    });

    it('should create a TOGGLE_ACTIVE_LINE action', () => {
        const activeLine = true;
        const expectedAction = {
            type: 'TOGGLE_ACTIVE_LINE',
            payload: activeLine
        };
        expect(actions.toggleActiveLine(activeLine)).to.eql(expectedAction);
    });

    it('should create a TOGGLE_GUTTER action', () => {
        const gutter = true;
        const expectedAction = {
            type: 'TOGGLE_GUTTER',
            payload: gutter
        };
        expect(actions.toggleGutter(gutter)).to.eql(expectedAction);
    });

    it('should create a UPDATE_CODE action', () => {
        const code = [
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
        ];
        const projectName = "New Project";
        const expectedAction = {
            type: 'UPDATE_CODE',
            payload: [code, projectName]
        };
        expect(actions.updateCode(code, projectName)).to.eql(expectedAction);
    });

    it('should create a UPDATE_CURSOR action', () => {
        const cursor = { row: 4, column: 12 };
        const expectedAction = {
            type: 'UPDATE_CURSOR',
            payload: cursor
        };
        expect(actions.updateCursor(cursor)).to.eql(expectedAction);
    });

    it('should create a UPDATE_FONT_SIZE action', () => {
        const fontSize = 12;
        const expectedAction = {
            type: 'UPDATE_FONT_SIZE',
            payload: fontSize
        };
        expect(actions.updateFontSize(fontSize)).to.eql(expectedAction);
    });

    it('should create a UPDATE_THEME action', () => {
        const theme = "tomorrow_night_eighties";
        const expectedAction = {
            type: 'UPDATE_THEME',
            payload: theme
        };
        expect(actions.updateTheme(theme)).to.eql(expectedAction);
    });
});