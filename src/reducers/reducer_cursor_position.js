// state is not app state! only state this reducer is responsible for
export default function (state = { row: 0, column: 0 }, action) {
    switch (action.type) {
        case 'UPDATE_CURSOR':
            return action.payload;
    }
    return state;
}