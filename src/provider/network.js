const Network = {
  Offline: { rpc: "offline", tx_explorer: null },
  "Local RPC": { rpc: "http://127.0.0.1:8545", tx_explorer: null },
  "Ropsten Testnet": {
    rpc: "https://ropsten.infura.io/v3/ed36ba09872245c4913d425cb97d210c",
    wss: "wss://ropsten.infura.io/ws/v3/ed36ba09872245c4913d425cb97d210c",
    tx_explorer: "https://ropsten.etherscan.io/",
  },
  "Main Net": {
    rpc: "https://mainnet.infura.io/v3/ed36ba09872245c4913d425cb97d210c",
    wss: "wss://mainnet.infura.io/ws/v3/ed36ba09872245c4913d425cb97d210c",
    tx_explorer: "https://etherscan.io/",
  },
  "oracle": {
    
  }
};

module.exports = Network;
