import logo from '../img/image.png'
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";

import { useUserContext } from "./UserProvider";
import { useBasketContext } from "./Context/BasketProvider";

function Nav({ setSignUpClicked }) {

    const [cookies, setCookie, removeCookie ] = useCookies(['user'])

    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        navigate('/')
        window.location.reload()
    }

    const { user } = useUserContext();

    const { basket } = useBasketContext();

    const navigate = useNavigate()
    return (
        <nav>

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
            <div className="basket-icon" onClick={() => navigate('/basket')}><i className="fa-solid fa-basket-shopping"></i>{ basket.length != 0 ? <p>{basket.length}</p> : null }</div>
            <button onClick={() => navigate('/info')}>INFO</button>
            { user ? <button onClick={logout}>WYLOGUJ</button>  : null}
        </nav>
    );
}

export default Nav;
