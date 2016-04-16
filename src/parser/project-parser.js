import HTMLParser from 'htmlparser2';
import Libraries from './../components/libraries.json';

export default class Parser {
    
    constructor() {
        this.cdn = "";
    }
    
    setupParser() {
        
    }
    
    /**
     * finds index.html and inserts library after the head tag
     * @param code
     * @param index
     */
    insertLibrary(index, code) {
        this.findMatchingCDN(index);
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
}
