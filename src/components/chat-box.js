import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, FormControl, Button, Panel, Glyphicon } from 'react-bootstrap';

class ChatBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            chatInput: "",
            messages: []
        };

        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.setupChat = this.setupChat.bind(this);
        this.listUsers = this.listUsers.bind(this);
        this.whenInputChanged = this.whenInputChanged.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.printMessages = this.printMessages.bind(this);
    }

    componentWillMount() {
        this.props.socket.on('connect', this.connect);
        this.props.socket.on('disconnect', this.disconnect);
        this.props.socket.on('chatInfo', this.setupChat);
        this.props.socket.on('new msg', this.handleNewMessage);
    }

    componentWillUpdate() {
        let chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    connect() {
        //this.props.socket.emit('setupChat', {id: this.props.id});
    }

    disconnect() {

    }
    /**
     * on connection to project, display users and chats
     */
    setupChat(data) {
        this.setState({ users: data.users, messages: data.msgs });
    }
    /**
     * Display all connected users
     */
    listUsers() {
        let style = {
            font: {
                color: "black",
                fontSize: "11px"
            },
            glyph: {
                color: "green"
            }

        };
        return this.state.users.map((user, i) => {
            return (
                <div key={i} style={style.font}>
                    <Glyphicon style={style.glyph}glyph="user" /> {user}
                </div>
            );
        });
    }
    /**
     *  Display all chat messages for the project
     */
    printMessages() {

        let style = {
            color: "black",
            fontSize: "12px",
            paddingBottom: "5px"
        };

        return this.state.messages.map((msg, i) => {
            return (
                <div key={i} style={style}>
                    <b>{msg.user}: </b>{msg.message}
                </div>

            );
        });

    }

    whenInputChanged(event) {
        this.setState({ chatInput: event.target.value });
    }

    /**
     * handle user pressing Enter to send chat message
     */
    handleKeyPress(event) {
        if (event.charCode == 13) {
            this.props.socket.emit('chat msg', { id: this.props.id, msg: this.state.chatInput });
            this.setState({ chatInput: "" });
        }
    }

    /**
     * Incoming messages, setState will cause a re-render
     */
    handleNewMessage(data) {
        console.log(this.refs.chat);
        this.setState({
            messages: this.state.messages.concat([data.msg])
        });
    }

    render() {
        let style = {
            header: {
                marginLeft: "5px"
            },
            outer: {
                height: "100%"
            },
            chatbox: {
                marginLeft: "15px",
                marginRight: "2px",
                marginTop: "15px",
                height: "100%"
            },
            chatMessages: {
                overflowY: "auto",
                height: "100%",
                paddingBottom: "25px",
                backgroundColor: "#f4f4f4"
            },
            columns: {
                paddingRight: "0px",
                paddingLeft: "0px",
                height: "100%"
            },
            userColumn: {
                paddingLeft: "5px",
                height: "100%"
            },
            users: {
                overflowY: "auto",
                height: "100%",
                backgroundColor: "#f4f4f4"
            },
            input: {
                position: "absolute",
                bottom: "0",
                left: "0"
            }
        };

        if (!this.props.editorStreaming) {
            style.outer.display = "none"
        }

        return (
            <div style={style.outer}>
                <Row style={style.chatbox}>
                    <Col lg={8} style={style.columns}>

                        <Panel style={style.chatMessages} ref="chat">
                            <div id="chatMessages">
                                {this.printMessages() }

                                <FormControl
                                    style={style.input}
                                    type="text"
                                    value={this.state.chatInput}
                                    onChange={this.whenInputChanged}
                                    onKeyPress={this.handleKeyPress}
                                    placeholder="Enter chat here"/>
                            </div>
                        </Panel>


                    </Col>

                    <Col lg={4} xsHidden smHidden mdHidden  style={style.userColumn}>

                        <Panel style={style.users}>
                            {this.listUsers() }
                        </Panel>

                    </Col>
                </Row>

            </div>
        );
    }
}

// applications (redux) state to props, look in reducers/index;
function mapStateToProps(state) {
    return {
        editorStreaming: state.editorStreaming,
        id: state.projectId
    };
}

export default connect(mapStateToProps)(ChatBox);