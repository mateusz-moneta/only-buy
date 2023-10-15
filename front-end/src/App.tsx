import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Login from "./pages/login/login"

import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
