import {useBasketContext} from "../Context/BasketProvider";
import {useState, useRef} from "react";
import Opinie from '../Opinie';
import {useCookies} from "react-cookie";
import axios from "axios";
import RamenInput from "./RamenInput";
import {useKeycloak} from "@react-keycloak/web";
function RamenList({ramenList, dispatch}) {
    const [selected, setSelected ] = useState(null)
    const [ cookie, setCookie, removeCookie ] = useCookies(['user'])
    const [clicked, setClicked ] = useState(null)
    const handleOpinie = (ramen) => {
        setClicked(ramen)
        console.log(clicked)
    }

    const deleteFood = async (food) => {
        const token= keycloak.token

        try {
            await axios.delete('http://localhost:8000/food',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                data: { food: food },
            withCredentials: false
        }
        )
            dispatch({type: 'SET_RAMEN_LIST', payload: ramenList.filter(x => x !== food)})
        } catch {
        }
    }

    const deletePost = async (id) => {
        const token = keycloak.token;
        try {
            await axios.delete(
                `http://localhost:8000/post`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    data: { _id: id },
                    withCredentials: false,
                }
            );
        } catch (err) {
            console.log(err);
        }
    };
    const { addBasketContext } = useBasketContext()

    const { keycloak } = useKeycloak();
    const isLoggedIn = keycloak.authenticated;
    const hasRole = keycloak.hasRealmRole("admin")

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
                            { hasRole && isLoggedIn ? <button onClick={() => deleteFood(ramen)}><i className="fa-solid fa-x" ></i></button> : null}
                        </div>
                    </div>
                )
            })}

            {hasRole && isLoggedIn ? <RamenInput selected={selected} dispatch={dispatch} ramenList={ramenList}/> : null}
        </div>
    );
}

export default RamenList;
