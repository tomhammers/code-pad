const availableOptions = {
    theme: [
        {
            name: 'tomorrow',
            link: 'brace/theme/tomorrow'
        },
        {
            name: 'tomorrow night eighties',
            link: 'brace/theme/tomorrow_night_eighties'
        }
    ],
    fontSize: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
}

// state is not app state! only state this reducer is responsible for
export default function (state = availableOptions, action) {

    return state;
}