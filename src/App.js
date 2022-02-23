import React, { useContext, useEffect } from "react";

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./views/Login";
import Dashboard from "./views/Dashboard";

import { StorageContext } from "./provider";

const HomePage = ({ lockupStatus }) => {
  return (
    <div className="App-header">{lockupStatus ? <Dashboard /> : <Login />}</div>
  );
};

function App() {
  const { state, dispatch } = useContext(StorageContext);
  if (state && state.wallet !== null) {
    console.log("lockupStatus", state.lockupStatus);
  }

  return (
    <div className="App">
      <Router>
        <div className="App-header">
          {state && state.lockupStatus ? <Dashboard /> : <Login />}
        </div>
        {/* <Routes>
          <Route exact path="/" element={<HomePage lockupStatus={state.lockupStatus} />} />
          <Route path="/transfer" element={<Transfer />} />
        </Routes> */}
      </Router>
    </div>
  );
}

export default App;
