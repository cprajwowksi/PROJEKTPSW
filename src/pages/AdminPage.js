import Nav from "../components/Nav";
import axios from "axios";
import {useKeycloak} from "@react-keycloak/web";
import {useEffect, useState} from "react";
import Zamowienie from "../components/Basket/Zamowienie";
import zamowienie from "../components/Basket/Zamowienie";
function AdminPage (){
    const [zamowienia, setZamowienia] = useState([])
    const { keycloak } = useKeycloak();
    const getZamowienia = async () => {
        const token = keycloak.token

        try {
            const response = await axios.get('http://localhost:8000/zamowienie', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setZamowienia(response.data)
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getZamowienia()
    }, []);

    useEffect(() => {
        console.log(zamowienia)
    }, [zamowienia])
    const slownik_typow = {0: "przychodzace", 1: "przyjete", 2:"wykonane",3:"odrzucone"}
    const renderZamowienia = (type) => {
        return (
            <div>
                <h2>{slownik_typow[type]}</h2>
                <div className={`zamowienie zamowienie-${slownik_typow[type]}`}>
                    {zamowienia.filter(zamowienie => zamowienie.type === type).map(zamowienie => (
                        <Zamowienie
                            key={zamowienie._id}
                            id={zamowienie._id}
                            username={zamowienie.username}
                            cena={zamowienie.cena}
                            basket={zamowienie.basket}
                            zamowienia={zamowienia}
                            setZamowienia={setZamowienia}
                        />
                    ))}
                </div>
            </div>
        );
    };
    return (
      <>
        <Nav/>
          <div className='admin-page'>
              <div>
                  <h1>Zamówienia</h1>
                  <div className="admin-zamowienia">
                      {renderZamowienia(0)}
                      {renderZamowienia(1)}
                      {renderZamowienia(2)}
                      {renderZamowienia(3)}
                  </div>
              </div>
          </div>
      </>
    )
}

export default AdminPage