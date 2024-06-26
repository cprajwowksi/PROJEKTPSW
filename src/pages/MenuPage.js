import {useContext, useEffect, useReducer, useState} from "react";
import Nav from "../components/Nav";
import RamenList from "../components/Menu/RamenList";
import Footer from "../components/Footer";
import SushiList from "../components/Menu/SushiList";
import Extras from "../components/Menu/Extras";
import axios from "axios";
import {SignUpContext} from "../components/Context/LoginProvider";
import {useKeycloak} from "@react-keycloak/web";
function MenuPage() {
    const extras = [
        { name: 'Japanese Tea', price: '16zł' },
        { name: 'Japanese Beer', price: '12zł' },
        { name: 'Japanese Orangeade Ramune', price: '14zł' },
        { name: 'Japanese Water', price: '6zł' },
        { name: 'Japanese Rice', price: '4zł' },
        { name: 'Japanese Miso Soup', price: '8zł' }
    ]
    const initValues = {
        ramenClicked: true, sushiClicked:  false, extrasClicked: false, ramenList: [], sushiList: []
    }
    const reducer = (state, action) => {
        switch(action.type){
            case 'RAMEN_CLICKED':
                return {...state, ramenClicked: true, sushiClicked: false, extrasClicked: false}
            case 'SUSHI_CLICKED':
                return {...state, ramenClicked: false, sushiClicked: true, extrasClicked: false}
            case 'EXTRAS_CLICKED':
                return {...state, ramenClicked: false, sushiClicked: false, extrasClicked: true}
            case 'SET_RAMEN_LIST':
                return {...state, ramenList: action.payload}
            case 'SET_SUSHI_LIST':
                return {...state, sushiList: action.payload}
            default:
                return state
        }
    }
    const [ state, dispatch ] = useReducer(reducer, initValues)
    const { signUpClicked, setSignUpClicked } = useContext(SignUpContext);

    const getRamen = async () => {
        const token = keycloak.token
        console.log(token)
        try {
            const response = await axios.get('/food', {
                params: { type: 'ramen'},
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            await dispatch({type: 'SET_RAMEN_LIST', payload: response.data});
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getSushi =  async () => {
        const token = keycloak.token
        try {
            const response = await axios.get('/food', {
                params: { type: 'sushi' },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            await dispatch({type: 'SET_SUSHI_LIST', payload: response.data})
            console.log(response.data)
        } catch(err) {
            console.log(err)
        }
    }
    const { keycloak } = useKeycloak();
    const isLoggedIn = keycloak.authenticated;
    const hasRole = keycloak.hasRealmRole("admin")

    useEffect(() => {
        getRamen()
        getSushi()
    }, [keycloak.token]);



    return (
        <>
        <Nav setSignUpClicked={setSignUpClicked}/>
        <div className="menu-page">
            <div className="choose-buttons">
                <button className="ramen-choose choose" onClick={() => dispatch({type: 'RAMEN_CLICKED'})}>Rameny</button>
                <button className="sushi-choose choose" onClick={() => dispatch({type: 'SUSHI_CLICKED'})}>Sushi</button>
                <button className="extras-choose choose" onClick={() => dispatch({type: 'EXTRAS_CLICKED'})}>Extras</button>
            </div>
            {state.ramenClicked ? <RamenList ramenList={state.ramenList} dispatch={dispatch}/> : null}
            {state.sushiClicked ? <SushiList sushiLists={state.sushiList} dispatch={dispatch}/> : null }
            { state.extrasClicked ? <Extras extras={extras}/> : null }
            {hasRole && isLoggedIn ? <button className="choose">Edytuj karte</button> : null}
        </div>

        </>
    );
}

export default MenuPage;
