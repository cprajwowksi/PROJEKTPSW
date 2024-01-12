import logo from '../img/image.png'
import {useNavigate} from "react-router-dom";


function Nav({ setSignUpClicked }) {
    const navigate = useNavigate()
    return (
        <nav>
            <button onClick={() => setSignUpClicked(true)}>ZALOGUJ</button>
            <a><i className="fa-brands fa-square-facebook"></i></a>
            <a><i className="fa-brands fa-instagram"></i></a>
            <div className="logo-container" onClick={() => navigate('/')}>
                <img className="panda-logo" src={logo} alt="panda-logo"/>
            </div>
            <button> <i className="fa-solid fa-phone"></i></button>
            <button><i className="fa-solid fa-basket-shopping"></i></button>
            <button onClick={() => navigate('/info')}>INFO</button>
        </nav>
    );
}

export default Nav;
