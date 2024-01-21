import logo from '../img/image.png'
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";

import { useUserContext } from "./UserProvider";
import { useBasketContext } from "./Context/BasketProvider";
import mqtt from "mqtt";
import {useEffect, useState} from "react";

function Nav({ setSignUpClicked }) {

    const [cookies, setCookie, removeCookie ] = useCookies(['user'])
    const [infoMessage, setInfoMessage] = useState(
        localStorage.getItem('infoMessage') || ''
    );

    useEffect(() => {
        const infoClient = mqtt.connect('ws://localhost:9000/mqtt');

        infoClient.on('connect', () => {

            infoClient.subscribe('infoClient', (err) => {
                if (!err) {
                    console.log('Subskrypcja udana!');
                } else {
                    console.error('Błąd podczas subskrybowania:', err);
                }
            });
        });

        infoClient.on('message', (topic, message) => {
            const receivedMessage = message.toString();
            setInfoMessage(receivedMessage);
            localStorage.setItem('infoMessage', receivedMessage);
        });

        return () => {
            infoClient.end();
        };
    }, []);

    const logout = async () => {

        const client = mqtt.connect("ws://localhost:9000/mqtt");

        client.on("connect", async () => {
            await client.publishAsync("logout", Math.round(Math.random() * 5 + 20, 2).toString());
            navigate('/')
            window.location.reload();
            client.end()
        })

        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)

    }

    const { user } = useUserContext();

    const { basket } = useBasketContext();

    const navigate = useNavigate()




    return (
        <nav>
            <p className="mqtt-count">Ilosc zalogowanych użytkownikow to: {infoMessage}</p>
            {!user ? <button onClick={() => setSignUpClicked(true)}> ZALOGUJ </button> :
                    <button onClick={() => navigate('/profile')}>{user.first_name}</button>
            }
            {user && <button onClick={() => navigate('/menu')}>MENU</button>}
            <a href="https://www.facebook.com/profile.php?id=100086246228234"><i className="fa-brands fa-square-facebook"></i></a>
            <a href="https://www.instagram.com/panda_slupsk/"><i className="fa-brands fa-instagram"></i></a>
            <div className="logo-container" onClick={() => navigate('/')}>
                <img className="panda-logo" src={logo} alt="panda-logo"/>
            </div>
            <i className="fa-solid fa-phone"></i>
            <div className="basket-icon" onClick={() => user? navigate('/basket') : navigate('/')}><i className="fa-solid fa-basket-shopping"></i>{ basket.length != 0 ? <p>{basket.length}</p> : null }</div>
            <button onClick={() => navigate('/info')}>INFO</button>
            { user ? <button onClick={logout}>WYLOGUJ</button>  : null}
        </nav>
    );
}

export default Nav;
