import Header from "./Components/Header";
import Doctors from "./Pages/Doctors/Doctors";
import Home from "./Pages/Home";
import {Route, Routes} from "react-router-dom"
import NewDoctor from "./Pages/Doctors/NewDoctor";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/newDoctor" element={<NewDoctor/>}/>
      </Routes>
    </div>
  );
}

export default App;
