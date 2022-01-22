import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import { Container, Nav, NavDropdown, Form } from "react-bootstrap";
import { store } from "../provider";
import walletIcon from "./../wallet.svg";

// Navbar for the page
const NavbarMenu = () => {
  function lockWalletClickHandler() {}
  function backupWalletClickHandler() {}

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src={walletIcon}
              width="25"
              height="25"
              className="d-inline-block align-top"
            />{" "}
            TR7 Wallet
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Form.Select aria-label="Default select example" defaultValue={"2"}>
              <option value="1">Mainnet</option>
              <option value="2">Ropsten</option>
            </Form.Select>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
const Dashboard = () => {
  const { state, dispatch } = useContext(store);
  const wallet = state.wallet;
  function sendTokenHandler() {}
  function receiveTokenHandler() {}
  function swapTokenHandler() {}

  return (
    <div>
      <NavbarMenu />
      <h1 className="py-4">Main Wallet</h1>
      <h5>Address: {wallet.address}</h5>
      <h5>Mnemonic: {wallet.mnemonic.phrase}</h5>
      <h5>Private: {wallet.privateKey}</h5>

      <span>
        <Button className="mx-2" onClick={sendTokenHandler}>
          SEND
        </Button>
        <Button className="mx-2" onClick={receiveTokenHandler}>
          RECEIVE
        </Button>
        <Button className="mx-2" onClick={swapTokenHandler}>
          SWAP
        </Button>
      </span>
    </div>
  );
};

export default Dashboard;
