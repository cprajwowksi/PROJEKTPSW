function Extras({extras}) {
    return (
        <div className="extras-list">
            <div>
                <h1>Extras</h1>
            </div>
            <div className="extras">
                {extras.map(extra => {
                    return (
                        <div className="extra-item">
                            <div className="extra-header">
                                <h3>{extra.name}</h3>
                                <p>{extra.price}zł</p>
                            </div>
                            <div className="przyciski">
                                <button className="dodaj">Dodaj do zamówienia</button>
                                <button className="opinie">Opinie</button>
                                <button className="edytuj">Edytuj</button>
                            </div>
                        </div>
                )
                })}
            </div>
        </div>
    );
}

export default Extras;
