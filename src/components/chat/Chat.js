import {useEffect, useState} from "react";
import axios, {post} from "axios";
import {useCookies} from "react-cookie";

function ChatHTTPS() {
    const [selectedUser, setSelectedUser] = useState(null)
    const [ message, setMessage] = useState()
    const [ editClicked, setEditClicked ] = useState(false)
    const [ edit, setEdit ] = useState("")
    const [users, setUsers] = useState([])
    const [ messages, setMessages ] = useState([])
    const [adminMessages, setAdminMessages] = useState([])
    const messageChange = (e) => {
        setMessage(e.target.value)
    }
    const [cookies, setCookie, removeCookie ] = useCookies(['user'])

    const handleEditChange = (e) => {
        setEdit(e.target.value)
    }
    const deleteMessage = async (message) => {

        try {
            await axios.delete(`http://localhost:8000/message`, {
                data: { message }
            })
        } catch(err) {
            console.log(err)
        }
    }

    const editMessage = async (message) => {
        const edited = { ...message, message: edit}
        try {
            await axios.put(`http://localhost:8000/message`, {
                data: { message: message, edited: edited }
            })
        } catch(err) {
            console.log(err)
        }
    }
    const postMessage =  async () => {
        const formattedMessage = {
            message: message,
            date: new Date(),
            from_id: cookies.UserId,
            to_id: (cookies.UserId === '8d0c54a6-e85d-4426-82a2-21afcedc1e9f' ?  selectedUser : '8d0c54a6-e85d-4426-82a2-21afcedc1e9f')
        }
        try {
            const response = await axios.post(`http://localhost:8000/messages`, {
                data: { message: formattedMessage }
            })

        } catch(err) {
            console.log(err)
        }
    }


    const getMyMessages =  async () => {

        try {
            const response = await axios.get(`http://localhost:8000/messages`, {
                params: { userId: (cookies.UserId === '8d0c54a6-e85d-4426-82a2-21afcedc1e9f' ?  selectedUser : cookies.UserId), toId: '8d0c54a6-e85d-4426-82a2-21afcedc1e9f' }
            })
            setMessages(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    const getAdminMessages =  async () => {

        try {
            const response = await axios.get(`http://localhost:8000/messages`, {
                params: { userId: '8d0c54a6-e85d-4426-82a2-21afcedc1e9f', toId: (cookies.UserId === '8d0c54a6-e85d-4426-82a2-21afcedc1e9f' ?  selectedUser : cookies.UserId) }
            })
            setAdminMessages(response.data)
        } catch(err) {
            console.log(err)
        }
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
        if (cookies.UserId === '8d0c54a6-e85d-4426-82a2-21afcedc1e9f') {
            getUsers()
        }
        getMyMessages();
        getAdminMessages()

        const intervalId = setInterval(() => {
            getMyMessages();
            getAdminMessages()
        }, 5000);

        return () => clearInterval(intervalId);
    }, [selectedUser]);

    const wiadomosci = [...messages, ...adminMessages]
    return (
        <div className="chat">
            <div className="chat-container">
                <div className="chat-history">{
                    wiadomosci.map((data, index) => {
                        return (
                            <p key={index}>

                                { data.from_id === cookies.UserId ?
                            <p> {cookies.UserId === '8d0c54a6-e85d-4426-82a2-21afcedc1e9f' ? 'Admin' : 'Client' } : {data.message} </p>
                            : <p>{cookies.UserId === '8d0c54a6-e85d-4426-82a2-21afcedc1e9f' ? 'Client' : 'Admin' } :  {data.message}</p>}
                                <i className="fa-solid fa-trash delete-opinia" onClick={() => deleteMessage(data)}></i>
                                <i className="fa-solid fa-pen-to-square" onClick={() => setEditClicked(!editClicked)}> </i>
                                { editClicked ? <>
                                    <input type="text" value={edit} onChange={handleEditChange}/>
                                    <i className="fa-solid fa-check" onClick={() => editMessage(data)}></i>
                                </> : null}
                            </p>)
                    } )
                }</div>
                <input type="text" value={message} onChange={messageChange}/>
                <button onClick={() => postMessage()}>WYSLIJ</button>
            </div>
            { cookies.UserId === '8d0c54a6-e85d-4426-82a2-21afcedc1e9f' ? <div>
                {users.map((user) => {
                    return (<button onClick={() => setSelectedUser(user.user_id)}>{user.first_name}</button>)
                })}
            </div> : null}
        </div>
    );
}

export default ChatHTTPS;
