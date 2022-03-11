import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import { Container, Form, Table, ListGroup, Modal } from "react-bootstrap";
import { StateContext } from "../provider";
import walletIcon from "./../wallet.svg";
import "./Dashboard.css";
import {
  ACTION_DELETE_WALLET,
  ACTION_LOCK_WALLET,
  ACTION_CHANGE_NETWORK,
} from "../provider";

const BackupModal = ({ wallet, closeHandler, completeHandler }) => {
  console.log("internal wallet", wallet);
  return (
    <Modal
      // {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show
      onHide={closeHandler}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text-primary"
        >
          BACKUP WALLET
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-warning">
          Backup your Seed Phrase and/or Private Key to restore wallet later (on
          any other wallets/devices)
        </p>
        <ListGroup horizontal className="my-2 ">
          <ListGroup.Item variant="primary">Addres</ListGroup.Item>
          <ListGroup.Item className="list-group-item-break">
            {wallet.address}
          </ListGroup.Item>
        </ListGroup>
        <ListGroup horizontal className="my-2">
          <ListGroup.Item variant="primary">Seed Phrase</ListGroup.Item>
          <ListGroup.Item className="list-group-item-break">
            {wallet.mnemonic.phrase}
          </ListGroup.Item>
        </ListGroup>
        <ListGroup horizontal className="my-2">
          <ListGroup.Item variant="primary">Private Key</ListGroup.Item>
          <ListGroup.Item className="list-group-item-break">
            {wallet.privateKey}
          </ListGroup.Item>
        </ListGroup>
        <ListGroup horizontal className="my-2">
          <ListGroup.Item variant="primary">Public Key</ListGroup.Item>
          <ListGroup.Item className="list-group-item-break">
            {wallet.publicKey}
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={completeHandler}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};

const ReceiveModal = ({ wallet, closeHandler, completeHandler }) => {
  console.log("internal wallet", wallet);
  return (
    <Modal
      // {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show
      onHide={closeHandler}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text-primary"
        >
          TOKEN RECEIVE
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-warning">
          This is an Ethereum ERC-20 address. Be careful, just send your ERC-20
          tokens to this address or you could lost your assets!!!
        </p>
        <ListGroup horizontal className="my-2 ">
          <ListGroup.Item variant="primary">Addres</ListGroup.Item>
          <ListGroup.Item className="list-group-item-break">
            {wallet.address}
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={completeHandler}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};

const DeleteModal = ({ wallet, closeHandler, completeHandler }) => {
  console.log("internal wallet", wallet);
  return (
    <Modal
      // {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show
      onHide={closeHandler}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="text-danger">
          DELETE WALLET
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-warning">
          {`BE CAUTIOUS!!!
          This process will clear all wallet data on this device.
          You would not be able recover your wallet without seed phrase/ private key.
          PLEASE backup the seed phrase/ private key before proceeding.`
            .split("\n")
            .map((i, key) => {
              return <div key={key}>{i}</div>;
            })}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={completeHandler} variant="danger">
          DELETE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
// Navbar for the page
const NetworkSelectList = ["Mainnet", "Ropsten", "Kovan", "Rinkeby", "Goerli"];
const NavbarMenu = ({ backupHandler, deleteWalletClickHandler }) => {
  const { state, dispatch } = useContext(StateContext);

  function lockWalletClickHandler() {
    dispatch({ type: ACTION_LOCK_WALLET });
  }
  function networkChangeHandler(event) {
    dispatch({ type: ACTION_CHANGE_NETWORK, payload: event.target.value });
  }

  return (
    <Container>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src={walletIcon}
              width="24"
              height="24"
              className="d-inline-block align-top"
            />{" "}
            TR7 Wallet
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Form.Select
              aria-label="Default select example"
              defaultValue={NetworkSelectList[1]}
              onChange={networkChangeHandler}
            >
              {NetworkSelectList.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </Form.Select>
            <Button
              className="mx-1 bg-dark text-nowrap"
              onClick={backupHandler}
            >
              Backup
            </Button>
            <Button
              onClick={lockWalletClickHandler}
              className="mx-1 bg-dark text-nowrap"
            >
              Lock
            </Button>
            <Button
              onClick={deleteWalletClickHandler}
              className="mx-1 bg-dark text-nowrap"
            >
              Delete
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Container>
  );
};
const MODAL_BACKUP = "BACKUP_WALLET";
const MODAL_RECEIVE = "MODAL_RECEIVE";
const MODAL_DELETE = "MODAL_DELETE";

const Dashboard = () => {
  let dollarUSLocale = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 6,
  });
  let balanceFormat = Intl.NumberFormat("en-US", { maximumFractionDigits: 6 });

  const { state, dispatch } = useContext(StateContext);
  const [modalType, $modalType] = React.useState();
  const wallet = state.wallet;
  console.log("dashboard wallet ", wallet);
  function sendTokenHandler() {}
  function receiveTokenHandler() {
    $modalType(MODAL_RECEIVE);
  }
  function swapTokenHandler() {}
  function backUpHandler() {
    $modalType(MODAL_BACKUP);
  }
  function deleteWalletClickHandler() {
    $modalType(MODAL_DELETE);
  }
  function deleteWalletHandler() {
    dispatch({ type: ACTION_DELETE_WALLET });
  }

  function closeHandler() {
    $modalType("");
  }

  var balanceTotal = 0;
  state.tokenList.map((token, index) => {
    balanceTotal += token.balance * token.priceUSDT;
  });

  return (
    <div>
      <NavbarMenu
        backupHandler={backUpHandler}
        deleteWalletClickHandler={deleteWalletClickHandler}
      />
      <h1 className="pt-4">Ethereum Blockchain</h1>
      <ListGroup horizontal className="mx-2">
        <ListGroup.Item variant="primary">Address</ListGroup.Item>
        <ListGroup.Item className="list-group-item-break">
          {wallet.address}
        </ListGroup.Item>
      </ListGroup>
      <div className="mt-4 mx-2">
        <ListGroup horizontal>
          <ListGroup.Item variant="primary">Balance</ListGroup.Item>
          <ListGroup.Item className="text-primary">
            {dollarUSLocale.format(balanceTotal)}
          </ListGroup.Item>
        </ListGroup>
        <Table
          striped
          bordered
          hover
          variant="dark"
          size="lg"
          responsive="xl"
          className="mt-1"
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Token</th>
              <th>Balance</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {state.tokenList.map((token, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{token.symbol}</td>
                  <td>{balanceFormat.format(token.balance)}</td>
                  <td>{dollarUSLocale.format(token.priceUSDT)}</td>
                  <td>
                    {dollarUSLocale.format(token.balance * token.priceUSDT)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <span>
        <Button className="mx-2" onClick={sendTokenHandler}>
          SEND
        </Button>
        <Button className="mx-2" onClick={receiveTokenHandler}>
          RECEIVE
        </Button>
        <Button className="mx-2" onClick={swapTokenHandler}>
          ADD TOKEN
        </Button>
        <Button className="mx-2" onClick={swapTokenHandler}>
          SWAP
        </Button>
      </span>
      {/* modal backup */}
      {modalType === "BACKUP_WALLET" ? (
        <BackupModal
          wallet={state.wallet}
          closeHandler={closeHandler}
          completeHandler={closeHandler}
        />
      ) : modalType === MODAL_RECEIVE ? (
        <ReceiveModal
          wallet={state.wallet}
          closeHandler={closeHandler}
          completeHandler={closeHandler}
        />
      ) : modalType === MODAL_DELETE ? (
        <DeleteModal
          wallet={state.wallet}
          closeHandler={closeHandler}
          completeHandler={deleteWalletHandler}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dashboard;
