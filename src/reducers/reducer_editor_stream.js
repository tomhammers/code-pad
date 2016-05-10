export default function(state = false, action) {
    switch(action.type) {
        case 'START_STREAMING_EDITOR':
        return true
        case 'STOP_STREAMING_EDITOR':
        return false
    }
    return state;
}