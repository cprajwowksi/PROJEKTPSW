import {useNavigate} from "react-router-dom";

function Menu() {
    const navigate = useNavigate()

    return (
        <div className="menu">
            <div className="menu-ramen menu-card">
                <button className="ramen-button menu-button" onClick={() => navigate('/menu')}>
                    <div className="ramen-card card" >
                    </div>
                </button>
                <h2>Ramen</h2>
            </div>
            <div className="menu-sushi menu-card">
                <button className="sushi-button menu-button" onClick={() => navigate('/menu')}>
                    <div className="sushi-card card" >
                    </div>
                </button>
                <h2>Sushi</h2>
            </div>
        </div>
    );
}

export default Menu;
