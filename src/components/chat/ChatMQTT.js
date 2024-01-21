import {useEffect, useState} from "react";
import axios, {post} from "axios";
import {useCookies} from "react-cookie";
import mqtt from 'mqtt'


function ChatMQTT() {
    const [ message, setMessage] = useState("")
    const [users, setUsers] = useState([])
    const [clickedUser, setSelectedUser] = useState(null)
    const [messages, setMessages ] = useState([])
    const [cookie, setCookie, removeCookie] = useCookies(['user'])
    const messageChange = (e) => {
        setMessage(e.target.value)
    }

    const getUsers =  async () => {
        try {
            const response = await axios.get(`http://localhost:8000/users`)
            setUsers(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUsers()
    }, []);

    useEffect(() => {
        if (clickedUser || cookie.UserId !== "8d0c54a6-e85d-4426-82a2-21afcedc1e9f" ) {
            const messagesClient = mqtt.connect('ws://localhost:9000/mqtt');
            messagesClient.on('connect', () => {

                messagesClient.subscribe(`chat/${cookie.UserId === "8d0c54a6-e85d-4426-82a2-21afcedc1e9f" ? clickedUser : cookie.UserId}`, (err) => {
                    if (!err) {
                        console.log('Subskrypcja udana!');
                    } else {
                        console.error('Błąd podczas subskrybowania:', err);
                    }
                });
            });

            messagesClient.on('message', (topic, message) => {
                const wynik = JSON.parse(message.toString());

                if (wynik.sender === 'server') {
                    setMessages((prevMessages) => [...prevMessages, wynik.message]);
                }
            });

            return () => {
                messagesClient.end();
            };

        }
    }, [clickedUser]);
    const postMessage =  async () => {

        try {
            const client = mqtt.connect(`ws://localhost:9000/mqtt`);

            const jsonData = { message: message, sender: 'client'};

            client.on("connect", async () => {
                console.log(cookie.UserId === "8d0c54a6-e85d-4426-82a2-21afcedc1e9f")
                await client.publishAsync(`chat/${cookie.UserId === "8d0c54a6-e85d-4426-82a2-21afcedc1e9f" ? clickedUser : cookie.UserId}`, JSON.stringify(jsonData));
            })

        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className="chat">
            <div className="chat-container">
                <ul id="message-list" className="message-list">
                    {messages.map((x, index) => <li key={index}>{x}</li>)}
                </ul>
                <input type="text" value={message} onChange={messageChange}/>
                <button className="auth-modal-button" onClick={() => postMessage()}>WYSLIJ</button>
            </div>
            {cookie.UserId === "8d0c54a6-e85d-4426-82a2-21afcedc1e9f" ? <div>
                {users.map((x, index) => <button key={index} className="auth-modal-button" onClick={() => setSelectedUser(x.user_id)}>{x.first_name}</button>)}
            </div> : null}

        </div>
    );
}

export default ChatMQTT;
