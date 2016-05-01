
let settings = {
    theme: 'ace/theme/tomorrow_night_eighties',
    fontSize: 14
}


// state is not app state! only state this reducer is responsible for
export default function (state = settings, action) {
    switch (action.type) {
        case 'UPDATE_FONT_SIZE':
            var newSettings = Object.assign({}, settings);
            newSettings.fontSize = action.payload;
            return newSettings

        case 'UPDATE_THEME':
            var newSettings = Object.assign({}, state);
            newSettings.theme = action.payload;
            return newSettings
    }
    return state;
}