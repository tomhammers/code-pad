import React, { Component } from 'react';
import { Row, Col, Input, Button, Panel } from 'react-bootstrap';


export default class ChatBox extends Component {
    
    constructor(props) {
        super(props);
        
        this.connect = this.connect.bind(this);
        this.setupChat = this.setupChat.bind(this);
        
        this.state = {
            users: []  
        };
       
    }
    
    componentWillMount() {
        this.props.socket.on('connect', this.connect);
        this.props.socket.on('chatInfo', this.setupChat);
    }
    
    connect() {
        //this.props.socket.emit('setupChat', {id: this.props.id});
    }
    
    setupChat(data) {
        console.log(data.users);
    }
    
    listUsers() {
        
    }

    render() {
        const innerButton = <Button bsStyle="primary">Send</Button>;

        let style = {
            header: {
                marginLeft: "5px"
            },
            chatbox: {
                marginLeft: "2px",
                marginRight: "2px",
                height: "350px"
            },
            chatMessages: {
                height: "300px",
                marginBottom: "5px"
            },
           
            users: {
                height: "339px"
            },
            columns: {
                paddingRight: "0px"
            },
            userColumn: {
                paddingLeft: "5px"
            }
        };

        return (
            <div>
                <h4 style={style.header}>Project Chat</h4>
                <hr />

                <Row style={style.chatbox}>
                    <Col lg={8} style={style.columns}>
                    
                        <Panel style={style.chatMessages}>
                        </Panel>
                        <Input type="text" buttonAfter={innerButton} />

                    </Col>
                    
                    <Col lg={4} xsHidden smHidden mdHidden  style={style.userColumn}>
                    
                        <Panel style={style.users}>
                            {this.listUsers}
                        </Panel>
                    
                    </Col>
                </Row>

            </div>
        );
    }
}