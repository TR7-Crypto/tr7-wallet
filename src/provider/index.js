import React, { createContext, useReducer } from "react";
import { ethers } from "ethers";

import network from "./network";
import abis from "../contracts/abis.js";

const tokenList = {
  Mainnet: [
    {
      name: "Ethereum",
      symbol: "ETH",
      icon: "",
      contractAddress: "",
      decimals: 18,
      description: `Ethereum is the community-run technology powering the cryptocurrency ether (ETH)
       and thousands of decentralized applications.`,
      url: "https://ethereum.org/",
      balance: "",
      priceUSDT: 2937.86,
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      icon: "",
      contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      decimals: 18,
      description: `UNISWAP PROTOCOL
      Swap, earn, and build on the leading decentralized crypto trading protocol.`,
      url: "https://uniswap.org/",
      balance: "",
      priceUSDT: 10.79,
    },
    {
      name: "ChainLink",
      symbol: "LINK",
      icon: "",
      contractAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      decimals: 18,
      description: `Securely connect smart contracts with off-chain data and services`,
      url: "https://chain.link/",
      balance: "",
      priceUSDT: 16.06,
    },
    {
      name: "SHIBA Inu",
      symbol: "SHIB",
      icon: "",
      contractAddress: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
      decimals: 18,
      description: `A Decentralized Meme Token that Evolved into a Vibrant Ecosystem`,
      url: "https://shibatoken.com/",
      balance: "",
      priceUSDT: 0.00002853,
    },
  ],
  Ropsten: [
    {
      name: "Ethereum",
      symbol: "ETH",
      icon: "",
      contractAddress: "",
      decimals: 18,
      description: `Ethereum is the community-run technology powering the cryptocurrency ether (ETH)
       and thousands of decentralized applications.`,
      url: "https://ethereum.org/",
      balance: "",
      priceUSDT: 2937.86,
    },
    {
      name: "CSC Token",
      symbol: "CSC",
      icon: "",
      contractAddress: "0xa06884A5651ceca0C013FdC4bD3C4BF47Cdf097e",
      decimals: 18,
      description: `Just an erc20 token for testing purpose`,
      url: "https://tr7-crypto.github.io/CSC-Token-ICO/",
      balance: "",
      priceUSDT: 2.86,
    },
    {
      name: "SHIBA Inu",
      symbol: "SHIB",
      icon: "",
      contractAddress: "0x34e12283f70b332a14E91a00A99396D41488b23f",
      decimals: 18,
      description: `A Decentralized Meme Token that Evolved into a Vibrant Ecosystem`,
      url: "https://shibatoken.com/",
      balance: "",
      priceUSDT: 0.00002853,
    },
    {
      name: "DAI",
      symbol: "DAI",
      icon: "",
      contractAddress: "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
      decimals: 18,
      description: `A better, smarter currency
      Dai can be used by anyone, anywhere, anytime.`,
      url: "https://shibatoken.com/",
      balance: "",
      priceUSDT: 0.9997,
    },
  ],
};
const initialSate = {
  isSaving: false,
  saveWallet: saveWalletToStorage,
  loadWallet: loadWalletFromStorage,
  unlockStatus: false,
  tokenList: tokenList.Ropsten,
  network: network.Ropsten,
  provider: "",
  signer: "",
  wallet: null,
  wallets: null,
  initWeb3Provider,
  fetchBalanceAndPrices,
};

export const StateContext = createContext(initialSate);

const { Provider } = StateContext;
const erc20Abi = [
  // Some details about the token
  "function name() view returns (string)",
  "function symbol() view returns (string)",

  // Get the account balance
  "function balanceOf(address) view returns (uint)",

  // Send some of your tokens to someone else
  "function transfer(address to, uint amount)",

  // An event triggered whenever anyone transfers to someone else
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

async function fetchExchangeRates() {
  /* Example in Node.js */
  const axios = require("axios");

  let response = null;
  new Promise(async (resolve, reject) => {
    try {
      response = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        {
          headers: {
            "X-CMC_PRO_API_KEY": "ae45a6c4-87d9-42e3-8188-46e0c9b4651b",
          },
        }
      );
    } catch (ex) {
      response = null;
      // error
      console.log(ex);
      reject(ex);
    }
    if (response) {
      // success
      const json = response.data;
      console.log(json);
      resolve(json);
    }
  });

  return response;
}
async function fetchBalanceAndPrices(provider, wallet, tokenList) {
  console.log("enter fetch balance");
  // console.log(`provider: ${provider}`);
  // console.log(`Address: ${wallet.address}`);
  //dev acc
  const address = "0x09858980B3B28a835D765C6cB3B1EE418070368C";
  // const address = wallet.address;
  const balance = await provider.getBalance(address);
  console.log("got eth balance");
  // console.log(`ETH: ${ethers.utils.formatEther(balance).toString()}`);
  // console.log("tokenList", tokenList);
  const getTokenBalance = async () => {
    return Promise.all(
      tokenList.map(async (token, index) => {
        if (token.symbol === "ETH") {
          tokenList[index].balance = ethers.utils.formatEther(balance);
          return;
        }
        const contractAddress = token.contractAddress;
        const contractAbi = new ethers.Contract(
          contractAddress,
          abis.erc20Artifact.abi, //erc20Abi,
          provider
        );
        const contractName = await contractAbi.name();
        // Get the balance of an address
        var tokenBalance = await contractAbi.balanceOf(address);
        console.log(`${contractName}: ${tokenBalance}`);
        if (token.symbol === "DAI") {
          tokenList[index].balance = ethers.utils.formatEther(tokenBalance);
        } else {
          tokenList[index].balance = tokenBalance.toNumber();
        }
      })
    );
  };
  await getTokenBalance();

  // console.log(tokenList);
  // fetch prices
  // const jsonExchangeRate = await fetchExchangeRates();
  console.log("return from get balance");
  return tokenList;
}

async function initWeb3Provider(initNetwork) {
  console.log("network rpc", initNetwork.rpc);
  const web3Network = initNetwork;

  const rpc = web3Network.rpc;
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  console.log(`network: ${network.name}, chainId: ${chainId}`);

  return provider;
}

async function saveWalletToStorage(wallet) {
  const json = JSON.stringify(true);
  localStorage.setItem("login", json);
  //try wallet.ecrypt
  //https://docs.ethers.io/v5/concepts/security/#security--pbkdf
  const encryptWallet = await wallet.encrypt(ENCRYPT_PASSWORD, {
    scrypt: {
      // The number must be a power of 2 (default: 131072)
      N: 65536,
    },
  });
  localStorage.setItem("jsonWallet", encryptWallet);
  console.log("saved");

  return encryptWallet;
}
async function loadWalletFromStorage() {
  let storedWallet = null;
  const jsonWallet = localStorage.getItem("jsonWallet");
  console.log("loadedWallet", jsonWallet);
  if (jsonWallet) {
    storedWallet = await ethers.Wallet.fromEncryptedJson(
      jsonWallet,
      ENCRYPT_PASSWORD
    );
  } else {
    storedWallet = null;
  }
  // await initWeb3Provider(initialSate);

  return storedWallet;
}

function init(initialSate) {
  const newState = { ...initialSate };
  const saved = localStorage.getItem("login");
  newState.unlockStatus = JSON.parse(saved);
  // initWeb3Provider(initialSate);
  return newState;
}

export const ACTION_SAVE_NEW_WALLET = Symbol("ACTION_SAVE_NEW_WALLET");
export const ACTION_IMPORT_WALLET = Symbol("ACTION_IMPORT_WALLET");
export const ACTION_LOCK_WALLET = Symbol("ACTION_LOCK_WALLET");
export const ACTION_UNLOCK_WALLET = Symbol("ACTION_UNLOCK_WALLET");
export const ACTION_LOAD_WALLET = Symbol("ACTION_LOAD_WALLET");
export const ACTION_DELETE_WALLET = Symbol("ACTION_DELETE_WALLET");
export const ACTION_CHANGE_NETWORK = Symbol("ACTION_CHANGE_NETWORK");

const ENCRYPT_PASSWORD = "TR7-Wallet";

const StateProvider = ({ children }) => {
  const reducerStorage = (state, action) => {
    const currentState = { ...state };
    switch (action.type) {
      case ACTION_CHANGE_NETWORK:
        currentState.network = network[action.payload];
        currentState.tokenList =
          tokenList[action.payload] || tokenList["Ropsten"];
        //initWeb3Provider(currentState);
        //re-load all here
        return currentState;

      case ACTION_LOAD_WALLET:
        if (action.payload !== undefined) {
          currentState.wallet = action.payload.respWallet;
          currentState.provider = action.payload.provider;
          console.log("resp token list", action.payload.respTokenList);
          currentState.tokenList = action.payload.respTokenList;
          currentState.unlockStatus = true;
        }
        return currentState;

      case ACTION_DELETE_WALLET:
        localStorage.clear();
        currentState.wallet = null;
        currentState.unlockStatus = false;
        return currentState;

      case ACTION_SAVE_NEW_WALLET:
      case ACTION_IMPORT_WALLET:
        if (action.payload !== undefined) {
          currentState.wallet = action.payload;
          currentState.unlockStatus = true;
        }

        return currentState;

      case ACTION_LOCK_WALLET:
        currentState.wallet = null;
        currentState.unlockStatus = false;
        return currentState;

      case ACTION_UNLOCK_WALLET:
        // const passPhrase = action.payload;
        // TODO: load from device storage
        if (action.payload !== undefined) {
          currentState.wallet = action.payload;
          currentState.unlockStatus = true;
        }
        currentState.wallet = action.payload; //loadWalletFromStorage();
        currentState.unlockStatus = true;
        return currentState;

      default:
        return currentState;
    }
  };

  const isPromise = (obj) => {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  };
  const middleware = (dispatch) => {
    return (action) => {
      if (isPromise(action.payload)) {
        action.payload.then((v) => {
          dispatch({ type: action.type, payload: v });
        });
      } else {
        dispatch(action);
      }
    };
  };
  const [state, dispatch] = useReducer(reducerStorage, initialSate, init);

  return (
    <Provider value={{ state, dispatch: middleware(dispatch) }}>
      {children}
    </Provider>
  );
};
export default StateProvider;
