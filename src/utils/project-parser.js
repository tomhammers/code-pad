import HTMLParser from 'htmlparser2';
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
     * Any methods from here involve scanning project for linked files
     */
    getCSSandJSfromHTML(html, callback) {
        let self = this;
        self.newHTML = html;

        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");

        let jsFiles = doc.getElementsByTagName('script');
        let cssFiles = doc.getElementsByTagName('link');
        let scriptFileNames = []; 
        let cssFileNames = [];

        for (let i = 0, l = jsFiles.length; i < l; i++) {
            scriptFileNames.push(doc.getElementsByTagName('script')[i].attributes.src.value);
            //self.removeFromDom('script', doc.getElementsByTagName('script')[i].attributes.src.value);
        }

        for (let i = 0, l = cssFiles.length; i < l; i++) {
            cssFileNames.push(doc.getElementsByTagName('link')[i].attributes.href.value);
            //self.removeFromDom('link', doc.getElementsByTagName('link')[i].attributes.href.value);
        }
        
        callback(scriptFileNames, cssFileNames);
    }

    /**
     * given a tagname and attribute, remove it from DOM
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


        // if (tempString.indexOf(attribute) !== -1) {
        //     if (!attribute.includes('http')) {
        //         console.log("removing index " + openIndex + " to " + closeIndex);
        //         self.newHTML = self.newHTML.substr(0, openIndex) + self.newHTML.substr(closeIndex);
        //     }
        // }
        // attribute = "";
        // tempString = "";


        // if (tagName === 'link') {
        //     console.log(tagName);
        //     let openIndex = self.newHTML.indexOf('<link rel');
        //     let closeIndex = self.newHTML.indexOf(attribute + '">') + 12;
        //     let length = closeIndex - openIndex;
        //     console.log(openIndex);
        //     console.log(closeIndex);
        //     console.log("Im removing " + attribute);
        //     self.newHTML = self.newHTML.substr(0, openIndex) + self.newHTML.substr(closeIndex);
        // }

        //console.log(this.newHTML);
    }
}


