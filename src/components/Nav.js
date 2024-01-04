import logo from '../img/image.png'
import fblogo from '../img/fblogo.png'
import iglogo from '../img/iglogo.png'

function Nav() {
    return (
        <nav>
            <button>ZALOGUJ</button>
            <button><img className="fb-logo" src={fblogo} alt="ig-logo"/></button>
            <button><img className="ig-logo" src={iglogo} alt="ig-logo"/></button>
            <div className="logo-container">
                <img className="panda-logo" src={logo} alt="panda-logo"/>
            </div>
            <button>CONTACT +48 605412523 &#9742; </button>
            <button>ZAMOW</button>


        </nav>
    );
}

export default Nav;
