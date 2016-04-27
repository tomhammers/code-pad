// state is not app state! only state this reducer is responsible for
export default function(state = 'index.html', action) {
    switch(action.type) {
        case 'FILE_SELECTED':
        return action.payload
    }
    return state;
}