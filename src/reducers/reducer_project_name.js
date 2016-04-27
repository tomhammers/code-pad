// state is not app state! only state this reducer is responsible for
export default function(state = '', action) {
    switch(action.type) {
        case 'SAVE_PROJECT':
        return action.payload
        
        case 'UPDATE_CODE':
        return action.payload[1]
        
        case 'NEW_PROJECT':
        return ''
    }
    return state;
}