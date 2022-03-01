import React, { createContext, useReducer } from "react";
import { ethers } from "ethers";

import Network from "./network";
import CSCArtifact from "../contracts/DappToken.json";

const tokenList = [
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: "",
    contractAddress: "",
    decimals: 18,
    description: `Ethereum is the community-run technology powering the cryptocurrency ether (ETH)
       and thousands of decentralized applications.`,
    url: "https://ethereum.org/",
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
  isSaving: false,
  saveWallet: saveWalletToStorage,
  loadWallet: loadWalletFromStorage,
  unlockStatus: false,
  wallet: null,
  wallets: null,
  tokenList: tokenList,
  network: "ropsten",
};

export const StorageContext = createContext(initialSate);

const { Provider } = StorageContext;

async function initWeb3Provider(wallet) {
  //init etherjs
  // Connect web3
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider(
    `https://ropsten.infura.io/v3/ed36ba09872245c4913d425cb97d210c`
  );
  // const provider = new ethers.providers.JsonRpcProvider(
  //   `https://mainnet.infura.io/v3/ed36ba09872245c4913d425cb97d210c`
  // );

  // const accounts = await provider.listAccounts();
  // console.log(accounts[0]);
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

  const network = await provider.getNetwork();
  const chainId = network.chainId;
  console.log(`network: ${network}, chainId: ${chainId}`);
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
  return storedWallet;
}

function init(initialSate) {
  const newState = { ...initialSate };
  const saved = localStorage.getItem("login");
  const unlockStatus = JSON.parse(saved) || false;
  newState.unlockStatus = unlockStatus;
  return newState;
}

export const ACTION_SAVE_NEW_WALLET = "SAVE_NEW_WALLET";
export const ACTION_IMPORT_WALLET = "IMPORT_WALLET";
export const ACTION_LOCK_WALLET = "LOCK_WALLET";
export const ACTION_UNLOCK_WALLET = "UNLOCK_WALLET";
export const ACTION_LOAD_WALLET = "UNLOCK_WALLET";
export const ACTION_DELETE_WALLET = "ACTION_DELETE_WALLET";

const ENCRYPT_PASSWORD = "TR7-Wallet";

const StateProvider = ({ children }) => {
  const reducerStorage = (state, action) => {
    const currentState = { ...state };
    switch (action.type) {
      case ACTION_LOAD_WALLET:
        if (action.payload !== undefined) {
          currentState.wallet = action.payload;
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
          // const json = JSON.stringify(currentState.unlockStatus);
          // localStorage.setItem("login", json);
          // //try wallet.ecrypt
          // //https://docs.ethers.io/v5/concepts/security/#security--pbkdf
          // currentState.wallet
          //   .encrypt(ENCRYPT_PASSWORD, {
          //     scrypt: {
          //       // The number must be a power of 2 (default: 131072)
          //       N: 65536,
          //     },
          //   })
          //   .then((json) => {
          //     localStorage.setItem("jsonWallet", json);
          //     console.log("saved");
          //   });
        }

        return currentState;

      case ACTION_LOCK_WALLET:
        currentState.wallet = null;
        currentState.unlockStatus = false;
        return currentState;

      case ACTION_UNLOCK_WALLET:
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
