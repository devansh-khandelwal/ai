import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./utils/Context";
import Login from "./Pages/LoginPage/login";
import Home from "./Pages/HomePage/home";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // const signUserOut = () => {
  //   localStorage.clear();
  //   setToken(false);
  //   window.location.pathname = "/";
  // };

  // useEffect(() => {
  //   if (token) signUserOut();
  // }, [token]);

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
