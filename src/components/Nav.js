import logo from '../img/image.png'
import fblogo from '../img/fblogo.png'
import iglogo from '../img/iglogo.png'

function Nav({ setSignUpClicked }) {

    return (
        <nav>
            <button onClick={() => setSignUpClicked(true)}>ZALOGUJ</button>
            <button><img className="fb-logo" src={fblogo} alt="ig-logo"/></button>
            <button><img className="ig-logo" src={iglogo} alt="ig-logo"/></button>
            <div className="logo-container">
                <img className="panda-logo" src={logo} alt="panda-logo"/>
            </div>
            <button>605412523 &#9742; </button>
            <button>ZAMOW</button>
            <button>INFO</button>
        </nav>
    );
}

export default Nav;
