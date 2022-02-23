import React, { createContext, useReducer } from "react";
import { ethers } from "ethers";
import simpleStorage from "simplestorage.js";
import Network from "./network";
import CSCArtifact from "../contracts/DappToken.json";

const tokenList = [
  {
    symbol: "ETH",
    icon: "",
    balance: 100000.01,
    priceUSDT: 2937.86,
  },
  {
    symbol: "UNI",
    icon: "",
    balance: 2.01,
    priceUSDT: 10.79,
  },
  {
    symbol: "LINK",
    icon: "",
    balance: 10.01,
    priceUSDT: 16.06,
  },
  {
    symbol: "SHIB",
    icon: "",
    balance: 100,
    priceUSDT: 0.00002853,
  },
];
const initialSate = {
  lockupStatus: false,
  wallet: null,
  wallets: null,
  tokenList: tokenList,
  network: "ropsten",
};

export const StorageContext = createContext(initialSate);

const { Provider } = StorageContext;

async function initWeb3Provider() {
  //init etherjs
  // Connect web3
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(
    `https://ropsten.infura.io/v3/ed36ba09872245c4913d425cb97d210c`
  );
  const accounts = await provider.listAccounts();
  console.log(accounts[0]);
  // dev account
  const address = "0x09858980B3B28a835D765C6cB3B1EE418070368C";
  const balance = await provider.getBalance(address);
  console.log(
    `The ${address} balance: ${ethers.utils.formatEther(balance).toString()}`
  );
  const signer = provider.getSigner();
  console.log(`signer ${signer._address}`);
  //CSC contract addr
  const contractAddress = "0xa06884A5651ceca0C013FdC4bD3C4BF47Cdf097e";
  // const contractAddress = "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2";

  const cscContract = new ethers.Contract(
    contractAddress,
    CSCArtifact.abi,
    provider
  );
  const contractName = await cscContract.name();
  console.log(`Contract name is ${contractName}`);
  // Get the balance of an address
  var cscBalance = await cscContract.balanceOf(address);
  console.log(`balance CSC ${cscBalance}`);

  // const network = await provider.getNetwork();
  // const chainId = network.chainId;
  // console.log(`network: ${network}, chainId: ${chainId}`);
  // You can also use an ENS name for the contract address

  // const daiAddress = "dai.tokens.ethers.eth";

  // // The ERC-20 Contract ABI, which is a common contract interface
  // // for tokens (this is the Human-Readable ABI format)
  // const daiAbi = [
  //   // Some details about the token
  //   "function name() view returns (string)",
  //   "function symbol() view returns (string)",

  //   // Get the account balance
  //   "function balanceOf(address) view returns (uint)",

  //   // Send some of your tokens to someone else
  //   "function transfer(address to, uint amount)",

  //   // An event triggered whenever anyone transfers to someone else
  //   "event Transfer(address indexed from, address indexed to, uint amount)",
  // ];

  // // The Contract object
  // const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
  // // Get the ERC-20 token name
  // console.log(await daiContract.name());
  // // 'Dai Stablecoin'

  // // Get the ERC-20 token symbol (for tickers and UIs)
  // console.log(await daiContract.symbol());
  // // 'DAI'

  // // Get the balance of an address
  // balance = await daiContract.balanceOf("ricmoo.firefly.eth");
  // console.log(`balance dai ${balance}`);
  // // { BigNumber: "22627477437309328201631" }

  // // Format the DAI for displaying to the user
  // ethers.utils.formatUnits(balance, 18);
  // console.log(`balance dai ${balance}`);
  // // '22627.477437309328201631'
}

function init(initialSate) {
  const newState = { ...initialSate };
  const saved = localStorage.getItem("login");
  const lockupStatus = JSON.parse(saved) || false;
  const savedWallet = localStorage.getItem("wallet");
  const wallet = JSON.parse(savedWallet) || null;
  newState.lockupStatus = lockupStatus;
  newState.wallet = wallet;
  //
  let jStorageWallet = simpleStorage.get("jStorageWallet");
  console.log("loaded jStorageWallet", jStorageWallet);
  initWeb3Provider();

  return newState;
}
export const ACTION_LOAD_WALLET = "LOAD_WALLET";
export const ACTION_SAVE_NEW_WALLET = "SAVE_NEW_WALLET";
export const ACTION_IMPORT_WALLET = "IMPORT_WALLET";
export const ACTION_LOCK_WALLET = "LOCK_WALLET";
export const ACTION_UNLOCK_WALLETT = "UNLOCK_WALLET";
function replacer(key, value) {
  if (typeof value === "function") {
    return "function";
  }
  return value;
}
const StateProvider = ({ children }) => {
  const walletProvider = ethers.getDefaultProvider(
    "https://ropsten.infura.io/v3/ed36ba09872245c4913d425cb97d210c"
  );
  const reducerStorage = (state, action) => {
    const currentState = { ...state };
    switch (action.type) {
      case ACTION_LOAD_WALLET:
        if (action.payload !== undefined) {
          currentState.wallet = action.payload;
          currentState.lockupStatus = true;
          const json = JSON.stringify(currentState.lockupStatus);
          localStorage.setItem("login", json);
          const wallet = JSON.stringify(currentState.wallet);
          localStorage.setItem("wallet", wallet);
        }
        return currentState;

      case ACTION_SAVE_NEW_WALLET:
      case ACTION_IMPORT_WALLET:
        if (action.payload !== undefined) {
          currentState.wallet = action.payload;
          currentState.lockupStatus = true;
          const json = JSON.stringify(currentState.lockupStatus);
          localStorage.setItem("login", json);
          console.log(" wallet", currentState.wallet);
          currentState.wallet = currentState.wallet.connect(walletProvider);
          //
          const wallet = JSON.stringify(currentState.wallet, [
            "address",
            "mnemonic",
            "privateKey",
            "publicKey",
          ]);
          localStorage.setItem("wallet", wallet);
          console.log("string wallet", wallet);
          //
          simpleStorage.set("jStorageWallet", currentState.wallet);
        }

        return currentState;

      case ACTION_LOCK_WALLET:
        currentState.wallet = null;
        currentState.lockupStatus = false;
        return currentState;

      case ACTION_UNLOCK_WALLETT:
        const passPhrase = action.payload;
        // TODO: load from device StorageContext
        return currentState;

      default:
        return currentState;
    }
  };

  const [state, dispatch] = useReducer(reducerStorage, initialSate, init);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
export default StateProvider;
