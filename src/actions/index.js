export function codeChange(code, fileName) {
    return {
        type: 'CODE_CHANGED',
        payload: [code, fileName]
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

