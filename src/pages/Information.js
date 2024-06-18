import Nav from "../components/Nav";
import Footer from "../components/Footer";
import {useReducer, useState} from "react";
import ChatHTTPS from "../components/chat/Chat";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";

function Information() {

    let navigate = useNavigate()

    const { keycloak } = useKeycloak();
    const isLoggedIn = keycloak.authenticated;
    const hasRole = keycloak.hasRealmRole("admin")

    return (
        <div className="info-page">
            <Nav/>
            <div className="info">
                <div className="info-adres">
                    <h2>Adres</h2>
                    <div>
                        <div>ul. Królowej Jadwigi 2B </div>

                        <div>76-200 Słupsk </div>
                    </div>
                </div>
                <div className="info-kontakt">
                    <h2>Kontakt</h2>
                    <div className="info-details">
                        <div className="info-email">
                            <i className="fa-regular fa-envelope"></i> pandasushi.slupsk@gmail.com
                        </div>
                        <div className="info-phone">
                            <i className="fa-solid fa-phone"></i> 787 787 926
                        </div>
                    </div>
                </div>
            </div>
            <div className="info">
                <div className="info-godziny">
                    <h2>Godziny otwarcia</h2>
                    <div>Wtorek - Sobota: 13:00 - 21:00</div>
                    <div>Niedziela : 13:00 - 20:00</div>
                    <div>Poniedziałek: <i className="fa-solid fa-shop-lock"></i></div>
                </div>
            </div>
            {hasRole && isLoggedIn ? <div className="obudowa-admin">
                <button className="admin" onClick={() => navigate('/admin')}>STRONA ADMINA</button>
            </div> : null}
            <Footer/>
        </div>
    );
}

export default Information;
