// state is not app state! only state this reducer is responsible for
export default function(state = false, action) {
    switch(action.type) {
        
        case 'SHOW_OPEN_MODAL':
        return true

    }
    return state;
}