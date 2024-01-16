import Home from "./pages/Home";
import Onboarding from "./pages/OnBoarding";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MenuPage from "./pages/MenuPage";
import Information from "./pages/Information";
import Profile from "./pages/Profile";
import { UserProvider } from "./components/UserProvider";
import {useCookies} from "react-cookie";
import {BasketProvider} from "./components/Context/BasketProvider";
import BasketPage from "./pages/BasketPage";
function App() {
    const [cookie, setCookie, removeCookie] = useCookies(['user']);
    //
    const userId = cookie.UserId

  return (
    <div className="App">
        <BrowserRouter>
            <UserProvider>
                <BasketProvider>
            <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/onboarding" element={<Onboarding/>}/>
                    { userId && <Route path="/profile" element={<Profile/>}/>}
                    { userId && <Route path="/basket" element={<BasketPage/>}/>}

                    <Route path="/menu" element={<MenuPage/>}/>
                    <Route path="/info" element={<Information/>}/>
            </Routes>
                </BasketProvider>
            </UserProvider>
        </BrowserRouter>
    </div>
  );
}

export default App;
