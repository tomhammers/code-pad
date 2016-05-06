// state is not app state! only state this reducer is responsible for
export default function(state = false, action) {
    switch(action.type) {
        
        case 'CLOSE_DIFF_MODAL':
        return false
        
        case 'SHOW_DIFF_MODAL':
        return true
        
        case 'UPDATE_CODE':
        return false
        
        case 'GO_ONLINE':
        return false
        
    }
    return state;
}