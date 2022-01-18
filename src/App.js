import wallet from "./wallet.svg";
import "./App.css";
import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import CreateWallet from "./views/CreateWallet";
import ImportWallet from "./views/ImportWallet";

const Home = () => {
  return (
    <div>
      <div className="text-primary my-5">Welcome to TR7 Wallet!</div>
      <div className="mb-4">
        <img src={wallet} width={200} className="App-logo" alt="wallet" />
      </div>
      <p>
        <span>
          <Link to="/creat-wallet" className="m-2">
            <Button className="">Create Wallet</Button>
          </Link>
          <Link to="/import-wallet" className="m-2">
            <Button>Import Wallet</Button>
          </Link>
        </span>
      </p>
    </div>
  );
};

function App() {
  // TODO: check wallet login

  return (
    <div className="App">
      <Router>
        <div className="App-header">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/creat-wallet" element={<CreateWallet />} />
            <Route path="/import-wallet" element={<ImportWallet />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
