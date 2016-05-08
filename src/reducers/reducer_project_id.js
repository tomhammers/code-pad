function generateUniqueID(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * 62));
    }
    return id;
}

export default function (state = generateUniqueID(10), action) {
    switch (action.type) {
        case 'GENERATE_PROJECT_ID':
            let id = generateUniqueID(10);
            return id
        case 'SET_PROJECT_ID':
            return action.payload
    }
    return state;
}