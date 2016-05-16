/**
 *  This file is used when project code needs to be parsed
 *  It is used to add libraries to the code, and to find links to css and js files
 */
import Libraries from '../libraries.json';

export default class Parser {

    constructor() {
        this.cdn = "";
        this.indexHTML = "";
        this.newHTML = "";
        // somewhere to store the filenames 
        this.cssFiles = [];
        this.jsFiles = [];

        this.getCSSandJSfromHTML = this.getCSSandJSfromHTML.bind(this);
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
        // finds <head> in code +6 so the index is at end
        let headTagIndex = this.indexHTML.indexOf('<head>') + 6;
        // the if statement is checking head exists
        if (headTagIndex > 6) {
            this.newHTML = this.indexHTML.substr(0, headTagIndex) + "\n        " + this.cdn + this.indexHTML.substr(headTagIndex);
            callback(this.newHTML);
        }
        // else do nothing ....
    }

    /**
     * Any methods from here on out involve scanning project for linked files
     */

    /**
     * Given the html, scan Dom for js and css links, passing to the callback the results
     * @param html
     * @param callback
     */
    getCSSandJSfromHTML(html, callback) {
        let self = this;
        self.newHTML = html;
        // DOMParser is a web API, can use it to parse the given HTML
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");

        let jsFiles = doc.getElementsByTagName('script');
        let cssFiles = doc.getElementsByTagName('link');
        let scriptFileNames = [];
        let cssFileNames = [];

        for (let i = 0, l = jsFiles.length; i < l; i++) {
            if (doc.getElementsByTagName('script')[i].attributes.src !== undefined) {
                scriptFileNames.push(doc.getElementsByTagName('script')[i].attributes.src.value);
                //self.removeFromDom('script', doc.getElementsByTagName('script')[i].attributes.src.value);
            }
        }

        for (let i = 0, l = cssFiles.length; i < l; i++) {
            if (doc.getElementsByTagName('link')[i].attributes.href !== undefined) {
                cssFileNames.push(doc.getElementsByTagName('link')[i].attributes.href.value);
                //self.removeFromDom('link', doc.getElementsByTagName('link')[i].attributes.href.value);
            }
        }

        callback(scriptFileNames, cssFileNames);
    }

    /**
     * TODO: not currently in use, does not work correctly yet
     * given a tagname and attribute, remove it from DOM
     * @param tagName
     * @param attribute
     */
    removeFromDom(tagName, attribute) {
        let self = this;
        // looks for correct dom element and removes it
        function removeCorrectTag(htmlString) {
            console.log(htmlString);
            let openIndex = htmlString.indexOf('<script');
            let closeIndex = htmlString.indexOf('</script>') + 9;
            // did we find a script tag?
            if (openIndex !== -1) {
                let length = closeIndex - openIndex;
                let tempString = self.newHTML.substr(openIndex, length);

                // does this script tag contain the right attribute?
                if (tempString.indexOf(attribute) !== -1)
                    self.newHTML = self.newHTML.substr(0, openIndex) + self.newHTML.substr(closeIndex);
                return;
            } else {

                // try again but with new string (remove what has already been checked)
                removeCorrectTag(htmlString.substr(closeIndex));
            }
        }

        if (tagName === 'script') {
            if (!attribute.includes('http')) {
                removeCorrectTag(self.newHTML);
            }
        }
        if (tagName === 'link') {
            removeCorrectTag(
                self.newHTML,
                self.newHTML.indexOf('<link rel'),
                self.newHTML.indexOf(attribute + '">') + 12
            );
        }

    }
}


