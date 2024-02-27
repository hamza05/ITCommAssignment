import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connection: null,
            user: '',
            message: '',
            chatMessages: [],
        };
    }

    componentDidMount() {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('/chathub')
            .withAutomaticReconnect()
            .build();

        this.setState({ connection: newConnection });

        newConnection
            .start()
            .then(response => console.log('Connection started!'))
            .catch(error => console.error(error));

        newConnection.on('ReceiveMessage', (user, receivedMessage) => {
            this.setState((prevState) => {
                const updatedMessages = [...prevState.chatMessages, `${user}: ${receivedMessage}`];
                return { chatMessages: updatedMessages };
            });
        });
    }

    componentWillUnmount() {
        this.state.connection.stop();
    }

    sendMessage = async () => {
        const { connection, user, message } = this.state;

        if (message) {
            await connection.invoke('SendMessage', user, message);
            this.setState({ message: '' });
        }
    };

    render() {
        const { user, chatMessages, message } = this.state;

        return (
            <div>
                <h2>Assignment 2 Chat</h2>
                <h5>Press Send multiple times until you see the message in the text area</h5>

                <input
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => this.setState({ user: e.target.value })}
                />
                <div>
                    <textarea
                        rows="10"
                        value={chatMessages.join('\n')}
                        readOnly
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Type your message"
                        value={message}
                        onChange={(e) => this.setState({ message: e.target.value })}
                    />
                    <button onClick={this.sendMessage}>Send</button>
                </div>
            </div>
        );
    }
}

export default Chat;
