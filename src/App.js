import Home from "./pages/Home";
import Onboarding from "./pages/OnBoarding";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MenuPage from "./pages/MenuPage";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                {/*{ authToken && <Route path="/dashboard" element={<Dashboard/>}/>}*/}
                <Route path="/onboarding" element={<Onboarding/>}/>
                {/*{ authToken && <Route path="/profile" element={<Profile/>}/>}*/}
                <Route path="/menu" element={<MenuPage/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
