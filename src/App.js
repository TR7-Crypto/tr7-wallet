import React, { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./views/Login";
import Dashboard from "./views/Dashboard";

import { ACTION_LOAD_WALLET, StorageContext } from "./provider";

const HomePage = ({ unlockStatus }) => {
  return (
    <div className="App-header">{unlockStatus ? <Dashboard /> : <Login />}</div>
  );
};

const LoadingScreen = () => {
  return (
    <Button variant="primary" disabled>
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      Loading Wallet...
    </Button>
  );
};

function App() {
  const { state, dispatch } = useContext(StorageContext);
  const [isLoading, $isLoading] = useState(true);
  console.log("unlockStatus", state.unlockStatus);
  console.log("isLoading", isLoading);
  useEffect(() => {
    const loadWallet = async () => {
      $isLoading(true);
      //load wallet
      try {
        console.log("try loading wallet");
        const respWallet = await state.loadWallet();
        dispatch({ type: ACTION_LOAD_WALLET, payload: respWallet });
      } catch (e) {
        console.log("load data err:", e);
      }

      $isLoading(false);
    };
    loadWallet();
  }, []);

  return (
    <div className="App">
      <Router>
        <div className="App-header  ">
          {isLoading == true ? (
            <LoadingScreen />
          ) : state && state.unlockStatus && state.wallet ? (
            <Dashboard />
          ) : (
            <Login />
          )}
        </div>
        {/* <Routes>
          <Route exact path="/" element={<HomePage unlockStatus={state.unlockStatus} />} />
          <Route path="/transfer" element={<Transfer />} />
        </Routes> */}
      </Router>
    </div>
  );
}

export default App;
