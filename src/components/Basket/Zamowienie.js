import React from 'react';
import keycloak from "../../keycloak/Keycloak";
import axios from "axios";

const Zamowienie = ({ id, username, cena, basket, zamowienia, setZamowienia }) => {
    const putZamowienie = async () => {
        const token = keycloak.token;
        try {
            await axios.put(
                `/zamowienie/increment`,
                {
                    data: { _id: id },
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: false,
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleZamowienieClick = () => {
        const updatedZamowienia = zamowienia.map(x =>
            x._id === id ? { ...x, type: x.type + 1 } : x
        );
        setZamowienia(updatedZamowienia);
        putZamowienie()
    };

    return (
        <div className="zamowienie-typ" onClick={handleZamowienieClick}>
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