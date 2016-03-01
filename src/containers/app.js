import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import Pouch from '../pouch/pouchdb';

import Header from './../components/header';
import LeftSidebar from './../components/left-sidebar';
import Pad from './../components/pad';
import Preview from './../components/preview';
import Modal from './../components/modal';

const socket = io('http://localhost:3000');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.pdb = new Pouch();
        // first create local DB if one doesn't exist (couch ignores otherwise)
        this.pdb.createDB('projects');
        // will be used for DB and socket.io and for unique URL for project
        this.uniqueID = this.generateUniqueID(10);
        this.initialCode = "<html>\n    <body>\n        \n    </body>\n</html>";
        this.projectNames = [];


        this.state = {
            title: 'Code-Pad',
            projectName: '',
            code: this.initialCode,
            showSaveModal: false,
            showOpenModal: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.createNewDoc = this.createNewDoc.bind(this);
        this.newProject = this.newProject.bind(this);
        this.openProject = this.openProject.bind(this);
        //this.open = this.open.bind(this);
    }

    componentWillMount() {
        console.log(this.uniqueID);
        socket.on('connect', this.connect);
        socket.on('disconnect', this.disconnect);
        socket.on('welcome', this.welcome);
    }

    generateUniqueID(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < length; i++) {
            // will admit to google for this part!
            id += chars.charAt(Math.floor(Math.random() * 62));
        }
        return id;
    }

    connect() {
        console.log('Connected! ' + socket.id);
    }

    disconnect() {
    }

    welcome(serverState) {
    }

    handleChange(stateToChange, value) {
        switch (stateToChange) {
            case 'code':
                this.setState({code: value});
                break;
            case 'saveAsInput':
                this.setState({projectName: value});
                break;
        }
    }

    handleSave() {
        // should set or update data before putting to DB
        this.pdb.setProjectDoc(this.uniqueID, 'index.html', this.state.code, this.state.projectName);

        if (this.state.projectName !== '') {
            // should save existing document
            this.pdb.upsertDoc();
        } else {
            // else show modal so user can name the project
            this.setState({ showSaveModal: true });
        }
    }

    newProject() {
        this.setState({projectName: '', code: this.initialCode});
    }

    openProject() {
        this.pdb.getDocs();
        this.setState({ showOpenModal: true });
        setTimeout(() => {
            for (let row of this.pdb.dbContents.rows) {
                //console.log(row.doc.projectName);
                this.projectNames.push(row.doc.projectName);
                console.log(this.projectNames);
            }
        }, 100);

    }

    createNewDoc() {
        this.pdb.setProjectDoc(this.uniqueID, 'index.html', this.state.code, this.state.projectName);
        this.pdb.upsertDoc();
        this.setState({ showSaveModal: false });
    }

    open() {
        console.log('open project called');

    }

    render() {
        return (
            <div>
                <Header
                    className="header"
                    title={this.state.title}
                    onSave={this.handleSave}
                    onNew={this.newProject}
                    onOpen={this.openProject}
                />

                <Modal
                    onChange={this.handleChange}
                    show={this.state.showSaveModal}
                    inputValue={this.state.projectName}
                    modalTitle='Save'
                    buttonTitle='Save'
                    buttonClick={ this.createNewDoc }
                />

                <Modal
                    show={this.state.showOpenModal}
                    modalTitle='Open Project'
                    buttonTitle='Close'
                    projects={this.projectNames}
                />

                <div className="row">
                    <LeftSidebar
                    />

                    <Pad
                        onChange={this.handleChange}
                        code={this.state.code}
                    />

                    <Preview
                        code={this.state.code}
                    />
                </div>
            </div>
        );
    }
}