// initial content
const initialFiles = [
    {
        fileName: "index.html",
        fileType: "html",
        content: "<html>\n    <head>\n    </head>\n    <body>\n        <h2><center>Welcomde to Code-Pad</center></h2>\n    </body>\n</html>"
    },
    {
        fileName: "script.js",
        fileType: "javascript",
        content: "console.log('hello world');"
    },
    {
        fileName: "style.css",
        fileType: "css",
        content: "body {\n        background-color: #363636;\n        color: white;\n        font-family: ‘Lucida Console’, Monaco, monospace;\n}"
    }
];

export default function (state = initialFiles, action) {
    let files = JSON.parse(JSON.stringify(initialFiles));
    switch (action.type) {
        // user making changes locally
        case 'CODE_CHANGED':
            for (let i = 0, l = files.length; i < l; i++) {
                if(files[i].fileName === action.payload[1]) {
                    files[i].content = action.payload[0];
                }
            }
            return files.concat([]);
        // external change to code (database or socket.io)    
        case 'UPDATE_CODE':
            console.log(action.payload[0]);
            return action.payload[0]
        // file -> new 
        case 'NEW_PROJECT':
            return initialFiles;
            
        default: 
            return state
    }   
}

