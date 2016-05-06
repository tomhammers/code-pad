// state is not app state! only state this reducer is responsible for
export default function(state = false, action) {
    switch(action.type) {
        
        case 'SHOW_SAVE_MODAL':
        return true
        
        case 'SAVE_PROJECT':
        return false
        
        case 'HIDE_SAVE_MODAL':
        return false
    }
    return state;
}