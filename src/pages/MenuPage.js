import {useState} from "react";
import Nav from "../components/Nav";
import RamenList from "../components/Menu/RamenList";
import Footer from "../components/Footer";
import SushiList from "../components/Menu/SushiList";
function MenuPage() {

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

    const sushiLists = [
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

    return (
        <>
        <Nav/>

        <div className="menu-page">
          <RamenList ramenList={ramenList}/>
            <SushiList sushiLists={sushiLists}/>
            <button>Edytuj karte ramenów</button>
            <Footer/>
        </div>

        </>
    );
}

export default MenuPage;
