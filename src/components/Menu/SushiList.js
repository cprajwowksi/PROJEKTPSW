function SushiList({sushiLists}) {
    return (
        <div className="ramen-list">
            {sushiLists.map(sushi => {
                return (
                    <div className="ramenlist-item">
                        <h2 className="list-header" key={sushi.name}>
                            <p>{sushi.name}</p>
                            {
                                Array.from({ length: sushi.spicy }, (_, index) => (
                                    <i key={index} className="fa-solid fa-pepper-hot"></i>
                                ))
                            }
                            {sushi.vege
                                ?
                                <i className="fa-solid fa-seedling text-green-500">
                                </i>
                                : null}
                            <p>{sushi.price}zł</p>
                            {sushi.raw ? <i className="fa-solid fa-fish-fins"></i> : null}
                            {sushi.bestseller ? <i className="fa-regular fa-star"></i> : null}
                        </h2>
                        <h3 className="opis">{sushi.subscription}</h3>

                        <div className="ingredients">
                            {sushi.ingredients.map(item => {
                                return (
                                    <p key={item} className="ingredient">{item}</p>
                                )
                            })}
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
    );
}

export default SushiList;
