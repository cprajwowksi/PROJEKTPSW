import React from 'react';
import keycloak from "../../keycloak/Keycloak";
import axios from "axios";

const Zamowienie = ({ id, username, cena, basket, zamowienia, setZamowienia }) => {

    return (
        <div className="zamowienie-typ">
            <div className="dane">
                <p>{username}</p>
                <p>{cena}zł</p>
            </div>
            <div className="kupione">
                {basket.map(item => (
                    <p key={item.id}>{item.name}</p>
                ))}
            </div>
        </div>
    );
};

export default Zamowienie;