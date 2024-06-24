import {useKeycloak} from "@react-keycloak/web";
import axios from "axios";
import {useEffect, useState} from "react";

function Posts() {
    const [text, setText] = useState()
    const [posty, setPosty] = useState([])
    const handleInputChange = (event) => {
        setText(event.target.value);
    };
    const postPost = async () => {
        const token = keycloak.token;
        try {
            await axios.post(
                `http://localhost:8000/post`,
                {
                    data: { message: text, username: keycloak.tokenParsed?.preferred_username, date: new Date().toISOString()},
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: false,
                }
            );
            setPosty([...posty,  {message: text, username: keycloak.tokenParsed?.preferred_username, date: new Date().toISOString()}])

        } catch (err) {
            console.log(err);
        }

    };
    const getPosty = async () => {
        const token = keycloak.token ? keycloak.token : "1"
        try {
            const response = await axios.get('http://localhost:8000/post', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPosty(response.data)
        } catch (err) {
            console.log(err);
        }
    };

    const deletePost = async (id) => {
        const token = keycloak.token;
        setPosty(posty.filter(x => x._id !== id))
        try {
            await axios.delete(
                `http://localhost:8000/post`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    data: { _id: id },
                    withCredentials: false,
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getPosty()
    }, []);

    const { keycloak } = useKeycloak();
    const isLoggedIn = keycloak.authenticated;
    const hasRole = keycloak.hasRealmRole("admin")

    return (
        <div className="posts">
            {posty.sort((a,b) => b.date.split('T')[0] - a.date.split('T')[0]).map(post => {
                return (
                    <div className="post">
                        <h2>{post.username}</h2>
                        <div className="post-body">
                            {post.message}
                        </div>
                        <div className="post-footer">
                            <i className="fa-regular fa-clock"></i>{`${post.date.split('T')[0]}`}
                        </div>
                        {hasRole && isLoggedIn ? <div className="post-buttons">
                            <button className="edit-post post-button">
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <button className="delete-post post-button">
                                <i className="fa-solid fa-trash-can" onClick={() => deletePost(post._id)}></i>
                            </button>
                        </div> : null}
                    </div>
                )
            })}
             {hasRole && isLoggedIn ?<div className="add-post">
                <form>
                    <input
                        type="text"
                        value={text}
                        onChange={handleInputChange}
                        placeholder="..."
                    />
                </form>
            </div> : null}
            {hasRole && isLoggedIn ? <button className="add-post" onClick={() => text.length > 0 ? postPost() : null}>
                DODAJ NOWY
            </button> : null}
        </div>
    );
}

export default Posts;
