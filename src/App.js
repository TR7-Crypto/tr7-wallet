import React, { useContext } from "react";

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./views/Login";
import Dashboard from "./views/Dashboard";

import { store } from "./provider";

const HomePage = ({ loginStatus }) => {
  return (
    <div className="App-header">{loginStatus ? <Dashboard /> : <Login />}</div>
  );
};

function App() {
  const { state, dispatch } = useContext(store);
  if (state && state.wallet !== null) {
    // console.log("wallet", state.wallet.mnemonic.phrase);
  }

  return (
    <div className="App">
      <Router>
        <div className="App-header">
          {state && state.loginStatus ? <Dashboard /> : <Login />}
        </div>
        {/* <Routes>
          <Route exact path="/" element={<HomePage loginStatus={state.loginStatus} />} />
          <Route path="/transfer" element={<Transfer />} />
        </Routes> */}
      </Router>
    </div>
  );
}

export default App;
