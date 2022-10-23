import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Pages/Layout";
import Login from "./Pages/Login";
import Maps from "./Pages/Maps";

function App() {
  return (
    <BrowserRouter>


        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/home" element={<Maps />} />
          </Route>


          {/* <Route path="*" element={<NotFound/>}></Route> */}

        </Routes>
    </BrowserRouter>
  );
}

export default App;
