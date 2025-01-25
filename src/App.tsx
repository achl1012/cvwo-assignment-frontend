import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateUser from "./pages/CreateUser";
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
    return (
        <div className="App">
              <BrowserRouter>
                  <Routes>
                      <Route path="/create-user" element={<CreateUser />}/>
                      <Route path="/home" element={<Home />} />
                      <Route path="/home/:threadId" element={<Home />}/>
                      <Route path="/" element={<Login />} />
                  </Routes>
              </BrowserRouter>
        </div>
    );
};

export default App;
