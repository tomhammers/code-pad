export default function(state = false, action) {
    switch(action.type) {
        case 'TOGGLE_RUN_BUTTON':
        return action.payload
    }
    return state;
}