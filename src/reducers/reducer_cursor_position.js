// state is not app state! only state this reducer is responsible for
export default function(state = { row: 0, column: 0 }, action) {
    switch(action.type) {
        case 'CODE_CHANGED':
        return action.payload[2]
    }
    return state;
}