import React, { useContext } from "react";
import { Modal, Button, Form, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import walletIcon from "./../wallet.svg";
import { ethers } from "ethers";
import { store } from "../provider";

const CreateWallet = ({ wallet, closeHandler, completeHandler }) => {
  const mnemonic = wallet.mnemonic.phrase;

  return (
    <>
      <Modal
        // {...props}
        size="md"
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
            CREAT WALLET
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-warning">
            Please backup this 12 mnemonic words in order to restore your wallet
            later
          </p>
          <h5 className="text-primary">{mnemonic}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={completeHandler}>Done</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
const ImportWallet = ({ closeHandler, completeHandler }) => {
  const [mnemonic, $mnemonic] = React.useState();
  const [validated, setValidated] = React.useState(false);
  const handleSubmit = (event) => {
    //TODO: validate as mnemonic is 12 words
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    completeHandler(mnemonic);
  };

  return (
    <>
      <Modal
        // {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show
        onHide={closeHandler}
      >
        <Form validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="text-primary"
            >
              IMPORT WALLET
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label htmlFor="inputPassword5" className="text-info">
              Please input 12 mnemonic words
            </Form.Label>
            <Form.Control
              required
              type="text"
              id="mnemonic-words"
              aria-describedby="passwordHelpBlock"
              as="textarea"
              rows={2}
              size="lg"
              onChange={(e) => $mnemonic(e.target.value)}
            />
            <Form.Text id="passwordHelpBlock" muted>
              Your mnemonic words must be exactly 12 words in order as you
              created your wallet.
            </Form.Text>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

const Home = () => {
  const [modalShow, $modalShow] = React.useState(false);
  const [modalType, $modalType] = React.useState();
  const [tempWallet, $tempWallet] = React.useState();
  const { state, dispatch } = useContext(store);

  function createWalletHandler() {
    $tempWallet(ethers.Wallet.createRandom());
    $modalType("CREATE_WALLET");
    $modalShow(true);
  }
  function completeCreateHandler() {
    dispatch({ type: "SAVE_NEW_WALLET", payload: tempWallet });
  }

  function importWalletHandler() {
    $modalType("IMPORT_WALLET");
    $modalShow(true);
  }
  async function createWalletFromMnemonic(mnemonic) {
    const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
    return wallet;
  }
  async function completeImportHandler(mnemonic) {
    const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
    dispatch({ type: "IMPORT_WALLET", payload: wallet });
    debugger;
  }

  // const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  function closeHandler() {
    $modalType("");
    $modalShow(false);
  }

  return (
    <div>
      <div className="text-primary mt-4 mb-2 fs-2 fw-bold">
        TR7 Ethereum Wallet
      </div>
      <div className="text-info mb-5">Getting started as Education Purpose</div>
      <div className="mb-4">
        <img src={walletIcon} width={200} className="App-logo" alt="wallet" />
      </div>
      <p>
        <span>
          <Button className="m-2" onClick={createWalletHandler}>
            Create Wallet
          </Button>
          <Button className="m-2" onClick={importWalletHandler}>
            Import Wallet
          </Button>
        </span>
      </p>
      {/* modal */}
      {modalType === "CREATE_WALLET" ? (
        <CreateWallet
          wallet={tempWallet}
          closeHandler={closeHandler}
          completeHandler={completeCreateHandler}
        />
      ) : modalType === "IMPORT_WALLET" ? (
        <ImportWallet
          closeHandler={closeHandler}
          completeHandler={completeImportHandler}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

const Login = () => {
  return <Home />;
};

export default Login;
