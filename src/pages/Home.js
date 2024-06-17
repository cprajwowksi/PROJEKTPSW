import Menu from '../components/Menu';
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Posts from "../components/Posts";
import AuthModal from "../components/Authentication/AuthModal";
import { useState, useRef } from "react";
import { SignUpContext } from '../components/Context/LoginProvider';
import React, { useContext } from 'react';

function Home() {
    const postsRef = useRef(null);
    const { signUpClicked, setSignUpClicked } = useContext(SignUpContext);

    const scrollToPosts = () => {
        postsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    return (
        <div className="homepage">
            <Nav/>
            <h1>Menu</h1>
            <Menu/>
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
