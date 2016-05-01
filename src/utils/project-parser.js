import HTMLParser from 'htmlparser2';
import Libraries from '../libraries.json';

export default class Parser {

    constructor() {
        this.cdn = "";
        this.indexHTML = "";
        this.newHTML = "";

        this.insertCDN = this.insertCDN.bind(this);
    }

    /**
     * finds index.html and inserts library after the head tag
     * @param code
     * @param index
     */
    insertLibrary(index, code, callback) {
        this.findMatchingCDN(index);
        this.findIndexHTML(code);

        this.insertCDN(returnNewCode.bind(this));
        function returnNewCode(newHTML) {
            for (let i = 0, l = code.length; i < l; i++) {
                if (code[i].fileName === "index.html") {
                    code[i].content = newHTML;
                }
            }
            return callback(code);
        }
    }

    /**
     * find the file to insert the library
     * @param code
     */
    findIndexHTML(code) {
        for (let i = 0, l = code.length; i < l; i++) {
            if (code[i].fileName === "index.html") {
                this.indexHTML = code[i].content;
            }
        }
    }

    /**
     * Finds correct CDN given the index of the button click
     * @param index
     */
    findMatchingCDN(index) {
        Libraries.libraries.map((library, i) => {
            if (i === index) {
                this.cdn = library.cdn;
            }
        });
    }

    /**
     * insert this.CDN into the correct place in this.indexHTML
     */
    insertCDN(callback) {
        let headTagIndex = this.indexHTML.indexOf('<head>') + 6;
        // checking if head tag exists
        if (headTagIndex > 6) {
            this.newHTML = this.indexHTML.substr(0, headTagIndex) + "\n    " + this.cdn + this.indexHTML.substr(headTagIndex);
        }
        callback(this.newHTML);
    }
}
