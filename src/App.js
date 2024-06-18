import Home from "./pages/Home";
import Onboarding from "./pages/OnBoarding";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MenuPage from "./pages/MenuPage";
import Information from "./pages/Information";
import Profile from "./pages/Profile";
import { UserProvider } from "./components/UserProvider";
import {useCookies} from "react-cookie";
import {BasketProvider} from "./components/Context/BasketProvider";
import { SignUpProvider } from "./components/Context/LoginProvider"
import BasketPage from "./pages/BasketPage";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak/Keycloak.js"
import {useEffect} from "react";
import PrivateRoute from "./keycloak/PrivateRoute";
import UserRoute from "./keycloak/UserRoute";
import AdminPage from "./pages/AdminPage";
function App() {
    const [cookie, setCookie, removeCookie] = useCookies(['user']);
    const userId = cookie.UserId

  return (
    <div className="App">
        <ReactKeycloakProvider authClient={keycloak}>
            <BrowserRouter>
                <SignUpProvider>
                    <UserProvider>
                        <BasketProvider>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/onboarding" element={<Onboarding/>}/>
                                {/*{ userId && <Route path="/profile" element={<Profile/>}/>}*/}
                                <Route path="/basket" element={
                                    <UserRoute>
                                        <BasketPage/>
                                    </UserRoute>
                                }/>
                                <Route path="/menu" element={<MenuPage/>}/>
                                <Route path="/info" element={<Information/>}/>
                                <Route path="/admin"  element={
                                    <PrivateRoute>
                                        <AdminPage />
                                    </PrivateRoute>
                                } />
                            </Routes>
                        </BasketProvider>
                    </UserProvider>
                </SignUpProvider>
            </BrowserRouter>
        </ReactKeycloakProvider>
    </div>
  );
}

export default App;
