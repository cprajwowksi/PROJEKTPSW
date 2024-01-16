import {useBasketContext} from "../components/Context/BasketProvider";
import Nav from "../components/Nav";
import { useMemo } from "react";

function BasketPage() {
    const {basket, deleteBasketContext} = useBasketContext()

    const wycena = useMemo(() => {
        return basket.reduce((total, item) => total + item.price, 0);
    }, [basket]);
    return (
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
            <div className="zamow"><button>ZAMOW</button></div>
        </div>
    );
}

export default BasketPage;
