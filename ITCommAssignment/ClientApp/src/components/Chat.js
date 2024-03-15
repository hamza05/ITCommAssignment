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
            selectedTimezone: 'US/Eastern',
            loading: true, // Add loading state
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
        stock.invoke('StreamStockData')
            .catch(error => console.error(error));
        this.setState({ loading: false });
    }

    render() {
        const { user, chatMessages, message, stockData, selectedTimezone, loading } = this.state;

        const stockForTimezone = Object.entries(stockData).map(([symbol, data]) => {
            console.log("data ddd    ");
            console.log(data);
            const jsondata = JSON.parse(data);
            const timeSeries = jsondata["Time Series (1min)"];
            console.log(timeSeries);
            // Check if timeSeries is defined and has at least one entry
            if (timeSeries && Object.keys(timeSeries).length > 0) {
                // Get the first entry in the timeSeries
                const timezoneData = timeSeries[Object.keys(timeSeries)[0]];

                // Check if timezoneData is defined
                if (timezoneData) {
                    const { '1. open': open, '4. close': close } = timezoneData;
                    return { symbol, open, close };
                }
            }

            return null; // Return null if data is missing or doesn't match expected structure
        }).filter(item => item !== null);


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

                <h2>Stock Data for {selectedTimezone}</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Opening Price</th>
                            <th>Closing Price</th>
                        </tr>
                    </thead>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (<></>)}
                        <tbody>
                            {stockForTimezone.map(({ symbol, open, close }) => (
                                <tr key={symbol}>
                                    <td>{symbol}</td>
                                    <td>{open}</td>
                                    <td>{close}</td>
                                </tr>
                            ))}
                        </tbody>
                    
                </table>
            </div>
        );
    }
}

export default Chat;
