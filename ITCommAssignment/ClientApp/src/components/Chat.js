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
            stockData: {},
        };
    }

    componentDidMount() {
        const chatConnection = new signalR.HubConnectionBuilder()
            .withUrl('/chathub')
            .withAutomaticReconnect()
            .build();

        const stockConnection = new signalR.HubConnectionBuilder()
            .withUrl('/stockhub')
            .withAutomaticReconnect()
            .build();

        this.setState({ connection: { chat: chatConnection, stock: stockConnection } });
        stockConnection
            .start()
            .then(() => {
                console.log('Stock connection started!');
                this.startStreaming();
            })
            .catch(error => console.error("stock error tech" + error));

        chatConnection
            .start()
            .then(() => console.log('Chat connection started!'))
            .catch(error => console.error(error));

       stockConnection.on('ReceiveStockData', (symbol, data) => {
            this.setState((prevState) => ({
                stockData: {
                    ...prevState.stockData,
                    [symbol]: data
                }
            }));
        });
        chatConnection.on('ReceiveMessage', (user, receivedMessage) => {
            this.setState((prevState) => {
                const updatedMessages = [...prevState.chatMessages, `${user}: ${receivedMessage}`];
                return { chatMessages: updatedMessages };
            });
        });

       
    }

    componentWillUnmount() {
        const { chat, stock } = this.state.connection;
        chat.stop();
        stock.stop();
    }

    sendMessage = async () => {
        const { connection, user, message } = this.state;

        if (message) {
            await connection.chat.invoke('SendMessage', user, message);
            this.setState({ message: '' });
        }
    };

    startStreaming() {
        const { stock } = this.state.connection;
        stock.invoke('StreamStockData').catch(error => console.error(error));
    }

    render() {
        const { user, chatMessages, message, stockData } = this.state;

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

                <h2>Stock Data</h2>

                {Object.entries(stockData).map(([symbol, data]) => (
                    <div key={symbol}>
                        <h3>{symbol}</h3>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                ))}
            </div>
        );
    }
}

export default Chat;
