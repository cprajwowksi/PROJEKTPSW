import {useReducer, useState} from "react";
import Nav from "../components/Nav";
import RamenList from "../components/Menu/RamenList";
import Footer from "../components/Footer";
import SushiList from "../components/Menu/SushiList";
import Extras from "../components/Menu/Extras";
function MenuPage() {
    const extras = [
        { name: 'Japanese Tea', price: '16zł' },
        { name: 'Japanese Beer', price: '12zł' },
        { name: 'Japanese Orangeade Ramune', price: '14zł' },
        { name: 'Japanese Water', price: '6zł' },
        { name: 'Japanese Rice', price: '4zł' },
        { name: 'Japanese Miso Soup', price: '8zł' }
    ]

    const classicMaki = {
        name:"Classic Maki",
        subscription:"klasyczne maki...",
        ingredients: ["łosoś/tuńczyk", "kanpyo", "ogórek", "japońska rzepa", "sałata", "sezam"],
        price: 38,
        spicy: 0,
        raw:true,
        vege: false,
        img: 'url',
        bestseller: false
    }

    const sushiLists = [{
        name: "Dragon Roll",
        subscription: "maki z ebi, awokado, ogórka, a wierzch pokryty wężowym awokado i krewetką",
        ingredients: ["krewetka ebi", "awokado", "ogórek", "awokado wężowe", "unagi sauce", "pikantny majonez"],
        price: 48,
        spicy: 1,
        raw: false,
        vege: false,
        img: 'url',
        bestseller: true
    },
        {
            name: "Rainbow Roll",
            subscription: "maki z surimi, awokado, ogórka, a wierzch pokryty różnokolorowymi plastrami łososia, tuńczyka i krewetki",
            ingredients: ["surimi", "awokado", "ogórek", "łosoś", "tuńczyk", "krewetka", "sos do sushi"],
            price: 50,
            spicy: 0,
            raw: true,
            vege: false,
            img: 'url',
            bestseller: false
        },
        {
            name: "Tempura Uramaki",
            subscription: "maki z krewetką tempura, awokado, ogórkiem, wierzch pokryty tempurą",
            ingredients: ["tempura krewetka", "awokado", "ogórek", "tempura", "teriyaki sauce", "świeży koper"],
            price: 44,
            spicy: 0,
            raw: false,
            vege: false,
            img: 'url',
            bestseller: false
        },
        {
            name: "Spicy Tuna Roll",
            subscription: "ostra wersja klasycznego maki z tuńczykiem",
            ingredients: ["tuńczyk", "ogórek", "awokado", "ostra majoneza", "sezam"],
            price: 42,
            spicy: 1,
            raw: true,
            vege: false,
            img: 'url',
            bestseller: true
        },
        {
            name: "Salmon Avocado Roll",
            subscription: "maki z łososiem i awokado",
            ingredients: ["łosoś", "awokado", "ogórek", "sałata", "świeży koperek", "limonka"],
            price: 45,
            spicy: 0,
            raw: true,
            vege: false,
            img: 'url',
            bestseller: false
        },
        {
            name: "Vegetarian Delight Roll",
            subscription: "wegetariańska wersja maki",
            ingredients: ["awokado", "ogórek", "papryka czerwona", "sałata", "świeży kolendra", "sezam"],
            price: 36,
            spicy: 0,
            raw: false,
            vege: true,
            img: 'url',
            bestseller: false
        },
        classicMaki
    ];
    const tantanRamen = {
        name: 'Tantanmen',
        subscription: 'Dla prawdziwych mężczyzn',
        ingredients: ["Kremowy bulion z kurczaka", "tare na bazie ucieranego sezamu","olej rayu","mielona wpierzowina","czerwona cebula","szczypiorek","prażone orzechy nerkowca","1/2 jajka"],
        price: 42,
        spicy: 2,
        vege: false,
        img: 'url',
        bestseller: true
    }

    const shioRamen = {
        name: 'Shio',
        subscription: 'Nikt nie je vege ramenów ale warto bo ładna ikonka',
        ingredients: ["Klarowny bulion z kurczaka", "tare na bazie soli", "olej chiyu", "plasterki chashu", "jajko na miękko", "algi nori", "zielona cebulka", "kukurydza"],
        price: 38,
        spicy: 0,
        vege: true,
        img: 'url',
        bestseller: false
    };

    const misoRamen = {
        name: 'Miso',
        subscription: 'haha',
        ingredients: ["Gęsty bulion miso", "makaron ramen", "marynowane bambusy", "kukurydza", "strzępki wodorostów", "kawałki kurczaka"],
        price: 45,
        spicy: 1,
        vege: false,
        img: 'url',
        bestseller: false
    };

    const shoyuRamen = {
        name: 'Shoyu',
        subscription: 'Dla osób, które lubią lekkie dania',
        ingredients: ["Klarowny bulion z kurczaka", "tare na bazie sosów sojowych", "olej chiyu","boczek chashu", "szczypiorek","japońskie grzyby","puder z trufli", "1/2 jajka"],
        price: 40,
        spicy: 0,
        vege: false,
        img: 'url',
        bestseller: true
    };

    const ramenList = [shoyuRamen, tantanRamen, misoRamen, shioRamen]

    const initValues = {
        ramenClicked: true, sushiClicked:  false, extrasClicked: false
    }
    const reducer = (state, action) => {
        switch(action.type){
            case 'RAMEN_CLICKED':
                return {...state, ramenClicked: true, sushiClicked: false, extrasClicked: false}
            case 'SUSHI_CLICKED':
                return {...state, ramenClicked: false, sushiClicked: true, extrasClicked: false}
            case 'EXTRAS_CLICKED':
                return {...state, ramenClicked: false, sushiClicked: false, extrasClicked: true}
        }
    }
    const [ state, dispatch ] = useReducer(reducer, initValues)

    return (
        <>
        <Nav/>
        <div className="menu-page">
            <div className="choose-buttons">
                <button className="ramen-choose choose" onClick={() => dispatch({type: 'RAMEN_CLICKED'})}>Rameny</button>
                <button className="sushi-choose choose" onClick={() => dispatch({type: 'SUSHI_CLICKED'})}>Sushi</button>
                <button className="extras-choose choose" onClick={() => dispatch({type: 'EXTRAS_CLICKED'})}>Extras</button>
            </div>
            {state.ramenClicked ? <RamenList ramenList={ramenList}/> : null}
            {state.sushiClicked ? <SushiList sushiLists={sushiLists}/> : null }
            { state.extrasClicked ? <Extras extras={extras}/> : null }
            <button className="choose">Edytuj karte</button>

        </div>

        </>
    );
}

export default MenuPage;
