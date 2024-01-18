import Menu from '../components/Menu';
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Posts from "../components/Posts";
import AuthModal from "../components/Authentication/AuthModal";
import { useState, useRef } from "react";
import Reklamy from "../components/Reklamy/reklamy";

function Home() {
    const [signUpClicked, setSignUpClicked] = useState(false);
    const postsRef = useRef(null);

    const scrollToPosts = () => {
        postsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    return (
        <div className="homepage">

            <Nav setSignUpClicked={setSignUpClicked}/>
            <Reklamy/>
            <h1>Menu</h1>
            { signUpClicked ? <AuthModal setSignUpClicked={setSignUpClicked}/> : <Menu/>}
            <Footer/>

            <div onClick={scrollToPosts} style={{ cursor: "pointer" }}>
                <h1><i className="fa-solid fa-circle-arrow-down"></i></h1>
            </div>

            <h1 ref={postsRef}>Aktualności</h1>
            { !signUpClicked ? <Posts/> : null}
        </div>
    );
}

export default Home;
