import logo from '../img/image.png'
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";

import { useUserContext } from "./UserProvider";
import { useBasketContext } from "./Context/BasketProvider";
import AuthModal from "./Authentication/AuthModal";
import {useContext} from "react";
import {SignUpContext} from "./Context/LoginProvider";
import {useKeycloak} from "@react-keycloak/web";

function Nav() {
    const { keycloak, initialized } = useKeycloak();
    const { basket } = useBasketContext();
    const navigate = useNavigate()

    return (
        <>
        <nav>
                    {!keycloak.authenticated && (
                        <button
                            type="button"
                            className="login"
                            onClick={() => keycloak.login()}
                        >
                            Login
                        </button>
                    )}
                    {!!keycloak.authenticated && (
                        <button
                            type="button"
                            className="login"
                            onClick={() => {
                                navigate('/')
                                keycloak.logout()
                                navigate('/')
                            }}
                        >
                            Logout ({keycloak.tokenParsed.preferred_username})
                        </button>
                    )}
            {/*{keycloak.authenticated && <button onClick={() => navigate('/menu')}>MENU</button>}*/}
            <a href="https://www.facebook.com/profile.php?id=100086246228234"><i className="fa-brands fa-square-facebook"></i></a>
            <a href="https://www.instagram.com/panda_slupsk/"><i className="fa-brands fa-instagram"></i></a>
            <div className="logo-container" onClick={() => navigate('/')}>
                <img className="panda-logo" src={logo} alt="panda-logo"/>
            </div>
            <i className="fa-solid fa-phone"></i>
            <div className="basket-icon" onClick={() => keycloak.authenticated ? navigate('/basket') : navigate('/')}><i className="fa-solid fa-basket-shopping"></i>{ basket.length != 0 ? <p>{basket.length}</p> : null }</div>
            <button onClick={() => navigate('/info')}>INFO</button>
            {/*{ user ? <button onClick={logout}>WYLOGUJ</button>  : null}*/}
        </nav>
            {/*{ signUpClicked ? <AuthModal setSignUpClicked={setSignUpClicked}/> : null}*/}
        </>
    );
}

export default Nav;
