function RamenList({ramenList}) {
    return (
        <div className="ramen-list">
            {ramenList.map(ramen => {
                return (
                    <div className="ramenlist-item">
                        <h2 className="list-header" key={ramen.name}>
                            <p>{ramen.name}</p>
                            {
                                Array.from({ length: ramen.spicy }, (_, index) => (
                            <i key={index} className="fa-solid fa-pepper-hot"></i>
                            ))
                            }
                            {ramen.vege
                            ?
                            <i className="fa-solid fa-seedling text-green-500">
                            </i>
                            : null}
                            <p>{ramen.price}zł</p>

                            {ramen.bestseller ? <i className="fa-regular fa-star"></i> : null}
                        </h2>
                        <h3 className="opis">{ramen.subscription}</h3>

                        <div className="ingredients">
                            {ramen.ingredients.map(item => {
                                return (
                                    <p key={item} className="ingredient">{item}</p>
                                )
                            })}
                        </div>
                        <div className="przyciski">
                            <button className="dodaj">Dodaj do zamówienia</button>
                            <button className="opinie">Opinie</button>

                        </div>

                    </div>
                )
            })}
            <form>
                <input/>
            </form>
        </div>
    );
}

export default RamenList;
