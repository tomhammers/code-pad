// initial content
const initialFiles = [
    {
        fileName: "index.html",
        fileType: "html",
        content: "<html>\n    <head>\n        <link rel=\"stylesheet\" href=\"style.css\">\n    </head>\n    <body>\n        <h1><center>Welcome to Code Pad</center></h1>\n        <script src=\"script.js\"></script>\n    </body>\n</html>"
    },
    {
        fileName: "script.js",
        fileType: "javascript",
        content: "console.log('hello world');"
    },
    {
        fileName: "style.css",
        fileType: "css",
        content: "body {\n    background-color: #363636;\n    color: #f9f7f7;\n    font-family: Tahoma, Geneva, sans-serif;\n}"
    }
];

export default function (state = initialFiles, action) {
    let files = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case 'ADD_FILE':
        let tempObj = {
            fileName: action.payload[0],
            fileType: action.payload[1],
            content: ""
        }
        files.push(tempObj);
        return files.concat([]);
        
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
            return action.payload[0];
        // file -> new 
        case 'NEW_PROJECT':
            return initialFiles;
            
        default: 
            return state
    }   
}

