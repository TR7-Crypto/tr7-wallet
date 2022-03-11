import React, { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./views/Login";
import Dashboard from "./views/Dashboard";

import { ACTION_LOAD_WALLET, StateContext } from "./provider";

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
  const { state, dispatch } = useContext(StateContext);
  const [isLoading, $isLoading] = useState(true);
  console.log("unlockStatus", state.unlockStatus);
  console.log("isLoading", isLoading);
  useEffect(() => {
    const loadWallet = async () => {
      $isLoading(true);
      //load wallet
      try {
        const respWallet = await state.loadWallet();
        const provider = await state.initWeb3Provider(state.network);
        const respTokenList = await state.fetchBalanceAndPrices(
          provider,
          respWallet,
          state.tokenList
        );
        console.log("completed loading");
        console.log("tokenlist", respTokenList);
        dispatch({
          type: ACTION_LOAD_WALLET,
          payload: { respWallet, provider, respTokenList },
        });
      } catch (e) {
        console.log("load data err: ", e);
      }

      $isLoading(false);
    };
    // console.log("state.wallet", state.wallet);
    if (!state.wallet) {
      loadWallet();
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <div className="App-header ">
          {isLoading === true ? (
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
