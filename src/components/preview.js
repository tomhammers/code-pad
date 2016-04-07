import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Col } from 'react-bootstrap';
import HTMLParser from 'htmlparser2';

export default class Preview extends Component {
    constructor(props) {
        super(props);
        // will hold the files in correct order
        this.htmlfiles = [];
        this.cssfiles = [];
        this.jsfiles = [];
        // recreate the html files for the iframe
        this.dom = new HTMLParser.parseDOM(this.props.code.files[0].content);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.sandbox = this.refs.iframe;
    }

    componentDidUpdate() {
        //this.parseProject();
        this.populateSandbox();
    }

    parseProject() {
        //console.log(this.props.code.files[0].content);
        // parse through all html files and find links to css or js files
        for (let i = 0, l = this.props.code.files.length; i < l; i++) {
            if (this.props.code.files[i].fileType === "html") {
                let self = this;
                let parser = new HTMLParser.Parser({
                    onopentag: function (name, attribs) {
                        // looking for script tags
                        if (name === "script") {
                            console.log(attribs);
                            for (let j = 0; j < l; j++) {
                                // if name in src="" matches fileName in current project
                                if (self.props.code.files[j].fileName === attribs.src) {
                                    self.files.push(self.props.code.files[j].content);
                                }
                            }
                        }
                        // now link tags (for stylesheets)
                        else if (name === "link") {
                            console.log(attribs);
                            for (let j = 0; j < l; j++) {
                                // if name in src="" matches fileName in current project
                                if (self.props.code.files[j].fileName === attribs.href) {
                                    self.files.push(self.props.code.files[j].content);
                                }
                            }
                        }
                        // build the html up
                        else {
                            self.newHtml += "<" + name;
                        }
                    },
                    ontext: function (text) {
                        // construct new html file
                        console.log(text);
                    }
                }, {decodeEntities: true});
                parser.write(this.props.code.files[i].content);
                parser.end();

                //const lineArr = string.split('/n');
                //console.log(lineArr);
                // console.log(string.split("\n").length);
                //if(string.indexOf("<link")!=-1) {
                //    console.log(string.indexOf("<link"));
                //}
            }
        }
        console.log(this.files);
    }

    populateSandbox() {
        // get all css files
        for (let i = 0, l = this.props.code.files.length; i < l; i++) {
            if (this.props.code.files[i].fileType === 'html') {
                this.htmlfiles.push(this.props.code.files[i].content);
            }
            if (this.props.code.files[i].fileType === 'css') {
                this.cssfiles.push(this.props.code.files[i].content);
            }
            if (this.props.code.files[i].fileType === 'javascript') {
                this.jsfiles.push(this.props.code.files[i].content);
            }
        }


        //let css = '' +
        //    '<style type="text/css">' +
        //    this.cssfiles[0] +
        //    '</style>';
        //let js = '' +
        //        '<script>' +
        //        this.props.jsCode +
        //        '</script>';
        let doc = this.sandbox.contentWindow.document;
        doc.open();
        for (let i = 0, l = this.htmlfiles.length; i < l; i++) {
            doc.write(this.htmlfiles[i])
        }
        for (let i = 0, l = this.cssfiles.length; i < l; i++) {
            doc.write(`<style type=\"text/css\">${this.cssfiles[i]}</style>`);
        }
        for (let i = 0, l = this.jsfiles.length; i < l; i++) {
            doc.write(`<script>${this.jsfiles[i]}</script>`);
        }
        //doc.write(this.props.htmlCode);
        //doc.write(css);
        //doc.write(js);
        doc.close();

        this.htmlfiles = [];
        this.cssfiles = [];
        this.jsfiles = [];
    }

    render() {

        let style = {
            iframeStyle: {
                height: this.props.height,
                width: '100%',
                border: '0',
                background: 'white'
            },
            iframeParent: {
                paddingRight: 0,
                paddingLeft: 0
            }
        };

        return (
            <Col lg={6} style={style.iframeParent}>
                <iframe ref="iframe" style={style.iframeStyle}>
                </iframe>
            </Col>
        );
    }
}

