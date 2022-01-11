import wallet from "./wallet.svg";
import "./App.css";
import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const createWalletHandle = () => {
    console.log("create wallet pressed");
  };
  const restoreWalletHandle = () => {
    console.log("restore wallet pressed");
  };
  const backupWalletHandle = () => {
    console.log("backup wallet pressed");
  };

  return (
    <div className="App">
      <Router>
        <div className="App-header">
          <p>TR7 Wallet!</p>
          <img src={wallet} className="App-logo" alt="wallet" />
          <span>
            <Button className="" onClick={createWalletHandle}>
              <Link to="/creat-wallet">Create Wallet</Link>
            </Button>
            <Button onClick={restoreWalletHandle}>Restore Wallet</Button>
          </span>
          <Button onClick={backupWalletHandle}>Backup Wallet</Button>
          <span>
            <Button onClick={backupWalletHandle}>Send</Button>
            <Button onClick={backupWalletHandle}>Receive</Button>
          </span>
        </div>
      </Router>
    </div>
  );
}

export default App;
