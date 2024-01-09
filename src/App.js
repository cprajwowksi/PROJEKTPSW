import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                {/*{ authToken && <Route path="/dashboard" element={<Dashboard/>}/>}*/}
                {/*{ authToken && <Route path="/onboarding" element={<Onboarding/>}/>}*/}
                {/*{ authToken && <Route path="/profile" element={<Profile/>}/>}*/}

            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
