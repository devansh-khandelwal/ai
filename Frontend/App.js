import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppProvider } from "./Context/AppContext";
import Login from "./login";
import Home from "./home";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  //For SignOut
  const signUserOut = () => {
    localStorage.clear();
    setToken(false);
    window.location.pathname = "/";
  };

  return (
    <div className="App">
      <AppProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login setToken={setToken} />} />
            <Route exact path="/home" element={<Home token={token} />} />
          </Routes>
        </Router>
      </AppProvider>
    </div>
  );
}

export default App;
