import {useBasketContext} from "../Context/BasketProvider";
import {useState, useRef} from "react";
import Opinie from '../Opinie';
function RamenList({ramenList}) {

    const [opinieClicked, setOpinieClicked] = useState(false)
    const [clicked, setClicked ] = useState(null)
    const selected = useRef(null)
    const handleOpinie = (ramen) => {
        setOpinieClicked(true)
        selected.current=ramen
        setClicked(selected.current)
    }

    const { addBasketContext } = useBasketContext()
    return (
        <div className="ramen-list">
            <Opinie food={clicked}/>
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
                            <button className="dodaj" onClick={() => addBasketContext(ramen)}>Dodaj do zamówienia</button>
                            <button className="opinie" onClick={() => handleOpinie(ramen)}>Opinie</button>
                            <button className="edytuj">Edytuj</button>
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
