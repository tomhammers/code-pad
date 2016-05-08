// state is not app state! only state this reducer is responsible for
export default function(state = false, action) {
    switch(action.type) {
        
        case 'SHOW_OPEN_SERVER_PROJECTS_MODAL':
        return true
        
        case 'CLOSE_OPEN_SERVER_PROJECTS_MODAL':
        return false

    }
    return state;
}