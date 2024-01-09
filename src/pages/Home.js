import Menu from '../components/Menu'
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AuthModal from "../components/Authentication/AuthModal";
import {useState} from "react";
function Home() {
    const [signUpClicked, setSignUpClicked] = useState(false)

    return (
        <div className="homepage">

            <Nav setSignUpClicked={setSignUpClicked}/>
            { signUpClicked ? <AuthModal setSignUpClicked={setSignUpClicked}/> : <Menu/>}
            <Footer/>

        </div>
    );
}

export default Home;
