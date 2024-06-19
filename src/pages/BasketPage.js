import {useBasketContext} from "../components/Context/BasketProvider";
import Nav from "../components/Nav";
import React, {useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import keycloak from "../keycloak/Keycloak";
import Zamowienie from "../components/Basket/Zamowienie";
import ZamowienieKlienta from "../components/Basket/ZamowienieKlienta";

function BasketPage() {
    const {basket, deleteBasketContext, setBasketContext} = useBasketContext()
    const [historiaZamowien, setHistoriaZamowien] = useState([])
    const wycena = useMemo(() => {
        return basket.reduce((total, item) => total + item.price, 0);
    }, [basket]);
    useEffect(() => {
        getZamowienie()
    }, []);
    const historiaRef = useRef(null);

    const scrollToPosts = () => {
        historiaRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    const getZamowienie = async () => {
        const token = keycloak.token
        try {
            const response = await axios.get('http://localhost:8000/zamowienie/moje', {
                params: { username: keycloak.tokenParsed.preferred_username },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setHistoriaZamowien(response.data)
        } catch (err) {
            console.log(err);
        }
    };

    const postZamowienie = async () => {
        const token = keycloak.token;
        try {
            await axios.post(
                `http://localhost:8000/zamowienie`,
                {
                    data: { basket: basket, cena: wycena, username: keycloak.tokenParsed?.preferred_username },
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: false,
                }
            );
            setBasketContext([]);
            window.reload()
        } catch (err) {
            setBasketContext([]);
            console.log(err);
        }
    };
    const slownik_typow = {0: "przychodzace", 1: "przyjete", 2:"wykonane",3:"odrzucone"}

    const renderZamowienia = (type) => {
        return (
            <div>
                <h2>{slownik_typow[type]}</h2>
                <div className={`zamowienie zamowienie-${slownik_typow[type]}`}>
                    {historiaZamowien.filter(zamowienie => zamowienie.type === type).map(zamowienie => (
                        <ZamowienieKlienta
                            key={zamowienie._id}
                            id={zamowienie._id}
                            username={zamowienie.username}
                            cena={zamowienie.cena}
                            basket={zamowienie.basket}
                            zamowienia={historiaZamowien}
                            setZamowienia={setHistoriaZamowien}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
        <div className="basket-page">
            <Nav/>
            <div className="basket">
                {basket.map((item) => {
                    return (
                        <div className="basket-item">
                            <div className="basket-item-headers">
                                <p>{item.name}</p>
                                <p>{item.price}zł</p>
                            </div>
                            <div className="basket-item-buttons">
                                <i className="fa-solid fa-x" onClick={() => deleteBasketContext(item)}></i>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="price">
                <h2>Ostateczna cena: {wycena}zł</h2>
            </div>
            <div className="zamow" onClick={() => wycena > 0 ? postZamowienie() : null}><button>ZAMOW</button></div>

            <div onClick={scrollToPosts} style={{ cursor: "pointer" }}>
                <h1><i className="fa-solid fa-circle-arrow-down"></i></h1>
            </div>
            <h1 ref={historiaRef}> HISTORIA ZAMOWIEN</h1>
        </div>

            <div className="basket-historia">
                {renderZamowienia(0)}
                {renderZamowienia(1)}
                {renderZamowienia(2)}
                {renderZamowienia(3)}
            </div>
        </>
    );
}

export default BasketPage;
