import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import StateProvider from "./provider";
//trying to submit commit for TW-3 from branch TW-3-testJiraGithub, but without the TW-3 in commits content

var ethers = require("ethers");
var url = "https://mainnet.infura.io/v3/ed36ba09872245c4913d425cb97d210c";
var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
const mnemonic =
  "giggle video holiday apart praise mail broom logic accuse rough ill uncover";
// const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const wallet = ethers.Wallet.createRandom();
// console.log("right after create");
// console.log("address:", wallet.address);
// console.log("mnemonic:", wallet.mnemonic.phrase);
// console.log("privateKey:", wallet.privateKey);

ReactDOM.render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
