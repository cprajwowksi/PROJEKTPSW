import {useBasketContext} from "../Context/BasketProvider";
import {useState, useRef} from "react";
import Opinie from '../Opinie';
import {useCookies} from "react-cookie";
import axios from "axios";
import RamenInput from "./RamenInput";
function RamenList({ramenList}) {
    const [selected, setSelected ] = useState(null)
    const [ cookie, setCookie, removeCookie ] = useCookies(['user'])
    const [clicked, setClicked ] = useState(null)
    const handleOpinie = (ramen) => {
        setClicked(ramen)
        console.log(clicked)
    }

    const deleteFood = async (food) => {
        console.log(food)
        try {
            const response = await axios.delete('http://localhost:8000/food', { data: food})
            console.log(response)
        } catch {

        }
    }
    console.log(cookie.UserId)
    const { addBasketContext } = useBasketContext()
    return (
        <div className="ramen-list">
            {clicked ? <Opinie food={clicked} setClicked={setClicked}/> : null}
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
                            { cookie.UserId === "8d0c54a6-e85d-4426-82a2-21afcedc1e9f" ? <button onClick={() => deleteFood(ramen)}><i className="fa-solid fa-x" ></i></button> : null}
                        </div>
                    </div>
                )
            })}
            <RamenInput selected={selected}/>
        </div>
    );
}

export default RamenList;
