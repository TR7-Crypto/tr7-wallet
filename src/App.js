import wallet from "./wallet.svg";
import "./App.css";
import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const createWalletHandle = () => {
    console.log("create wallet pressed");
  };
  const importWalletHandle = () => {
    console.log("restore wallet pressed");
  };
  const backupWalletHandle = () => {
    console.log("backup wallet pressed");
  };

  return (
    <div className="App">
      <Router>
        <div className="App-header">
          <p>Welcome to TR7 Wallet!</p>
          <p>
            <img src={wallet} width={200} className="App-logo" alt="wallet" />
          </p>
          <p>
            <span>
              <Link to="/creat-wallet">
                <Button className="" onClick={createWalletHandle}>
                  Create Wallet
                </Button>
              </Link>
              <Link to="/import-wallet">
                <Button onClick={importWalletHandle}>Import Wallet</Button>
              </Link>
            </span>
          </p>
        </div>
      </Router>
    </div>
  );
}

export default App;
