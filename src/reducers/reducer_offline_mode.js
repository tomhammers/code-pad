// state is not app state! only state this reducer is responsible for
export default function(state = 'true', action) {
    switch(action.type) {
        case 'GO_ONLINE':
        return false
        
        case 'GO_OFFLINE':
        return true
    }
    return state;
}