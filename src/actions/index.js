export function addFile(filename, fileType) {
    return {
        type: 'ADD_FILE',
        payload: [filename, fileType]
    };
}

export function closeDiffModal() {
    return {
        type: 'CLOSE_DIFF_MODAL'
    };
}

export function closeOpenServerProjectsModal() {
    return {
        type: 'CLOSE_OPEN_SERVER_PROJECTS_MODAL'
    };
}

export function closeSaveModal() {
    return {
        type: 'HIDE_SAVE_MODAL'
    };
}

export function codeChange(code, fileName) {
    return {
        type: 'CODE_CHANGED',
        payload: [code, fileName]
    };
}

export function deleteFile(fileName) {
    return {
        type: 'DELETE_FILE',
        payload: fileName
    };
}

export function generateProjectId() {
    return {
        type: 'GENERATE_PROJECT_ID'
    };
}

export function goOnline() {
    return {
        type: 'GO_ONLINE'
    };
}

export function goOffline() {
    return {
        type: 'GO_OFFLINE'
    };
}

export function newProject() {
    return {
        type: 'NEW_PROJECT'  
    };
}

export function saveProject(projectName) {
    return {
        type: 'SAVE_PROJECT',
        payload: projectName  
    };
}

export function selectFile(fileName) {
    return {
        type: 'FILE_SELECTED',
        payload: fileName  
    };
}

export function setProjectId(id) {
    return {
        type: 'SET_PROJECT_ID',
        payload: id  
    };
}

export function showDiffModal() {
    return {
        type: 'SHOW_DIFF_MODAL'  
    };
}

export function showOpenModal() {
    return {
        type: 'SHOW_OPEN_MODAL'  
    };
}

export function showOpenServerProjModal() {
    return {
        type: 'SHOW_OPEN_SERVER_PROJECTS_MODAL'  
    };
}

export function startStreamingEditor() {
    return {
        type: 'START_STREAMING_EDITOR'  
    };
}

export function stopStreamingEditor() {
    return {
        type: 'STOP_STREAMING_EDITOR'  
    };
}

export function showSaveModal() {
    return {
        type: 'SHOW_SAVE_MODAL'  
    };
}

export function toggleActiveLine(active) {
    return {
        type: 'TOGGLE_ACTIVE_LINE',
        payload: active  
    };
}

export function toggleGutter(active) {
    return {
        type: 'TOGGLE_GUTTER',
        payload: active  
    };
}

// user opens app from unique URL
export function updateCode(code, projectName) {
    return {
        type: 'UPDATE_CODE',
        payload: [code, projectName]  
    };
}

export function updateCursor(cursor) {
    return {
        type: 'UPDATE_CURSOR',
        payload: cursor
    };
}

export function updateFontSize(fontSize) {
    return {
        type: 'UPDATE_FONT_SIZE',
        payload: fontSize
    };
}

export function updateTheme(themeName) {
    return {
        type: 'UPDATE_THEME',
        payload: themeName
    };
}

