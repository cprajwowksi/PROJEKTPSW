import logo from '../img/image.png'
import {useNavigate} from "react-router-dom";


function Nav({ setSignUpClicked }) {
    const navigate = useNavigate()
    return (
        <nav>
            <button onClick={() => setSignUpClicked(true)}>ZALOGUJ</button>
            <a href="https://www.facebook.com/profile.php?id=100086246228234"><i className="fa-brands fa-square-facebook"></i></a>
            <a href="https://www.instagram.com/panda_slupsk/"><i className="fa-brands fa-instagram"></i></a>
            <div className="logo-container" onClick={() => navigate('/')}>
                <img className="panda-logo" src={logo} alt="panda-logo"/>
            </div>
            <i className="fa-solid fa-phone"></i>
            <i className="fa-solid fa-basket-shopping"></i>
            <button onClick={() => navigate('/info')}>INFO</button>
        </nav>
    );
}

export default Nav;
