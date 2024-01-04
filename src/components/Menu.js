function Menu() {
    return (
        <div className="menu">
            <div className="menu-ramen menu-card">
                <button className="ramen-button menu-button">
                    <div className="ramen-card card">
                    </div>
                </button>
                <h2>Ramen</h2>
            </div>
            <div className="menu-sushi menu-card">
                <button className="sushi-button menu-button">
                    <div className="sushi-card card">

                    </div>

                </button>
                <h2>Sushi</h2>
            </div>
        </div>
    );
}

export default Menu;
