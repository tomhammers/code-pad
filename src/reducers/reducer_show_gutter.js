// state is not app state! only state this reducer is responsible for
export default function(state = true, action) {
    switch(action.type) {
        case 'TOGGLE_GUTTER':
        return action.payload
    }
    return state;
}