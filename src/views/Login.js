import React, { useContext } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import walletIcon from "./../wallet.svg";
import { ethers } from "ethers";
import { StateContext } from "../provider";
import {
  ACTION_SAVE_NEW_WALLET,
  ACTION_IMPORT_WALLET,
  ACTION_UNLOCK_WALLET,
} from "../provider";

const SavingWallet = (props) => {
  const { percent, actionText } = props;

  return (
    <>
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show
      >
        <Button variant="primary" disabled size="sm">
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          {actionText}
        </Button>
      </Modal>
    </>
  );
};

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
            Please backup this seed phrase (12 words in order) to restore your
            wallet later
          </p>
          <h5 className="text-primary">{mnemonic}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={completeHandler}>Create</Button>
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
              Please input your seed phrase here (12 mnemonic words)
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
              Your seed phrase must be exactly 12 words in order as you created
              the wallet.
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

const MODAL_CREATE_WALLET = "CREATE_WALLET";
const MODAL_IMPORT_WALLET = "IMPORT_WALLET";
const MODAL_SAVING_WALLET = "MODAL_SAVING_WALLET";
const Home = () => {
  const [modalType, $modalType] = React.useState();
  const [actionText, $actionText] = React.useState("");
  const [tempWallet, $tempWallet] = React.useState();
  const { state, dispatch } = useContext(StateContext);

  async function savingWallet(wallet) {
    try {
      $modalType(MODAL_SAVING_WALLET);
      $actionText("saving wallet...");
      console.log("try saving wallet");
      const respWallet = await state.saveWallet(wallet);
      $modalType("");
      return wallet;
    } catch (err) {
      console.log("err", err);
    }
  }

  function createWalletHandler() {
    $tempWallet(ethers.Wallet.createRandom());
    $modalType(MODAL_CREATE_WALLET);
  }
  async function completeCreateHandler() {
    // await savingWallet(tempWallet);
    dispatch({
      type: ACTION_SAVE_NEW_WALLET,
      payload: savingWallet(tempWallet),
    });
  }

  function importWalletHandler() {
    $modalType(MODAL_IMPORT_WALLET);
  }
  async function createWalletFromMnemonic(mnemonic) {
    const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
    return wallet;
  }
  async function completeImportHandler(mnemonic) {
    const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
    await savingWallet(wallet);
    dispatch({ type: ACTION_IMPORT_WALLET, payload: wallet });
  }

  async function unlockingWallet() {
    try {
      $modalType(MODAL_SAVING_WALLET);
      $actionText("unlocking wallet...");
      console.log("try unlocking wallet");
      const respWallet = await state.loadWallet();
      $modalType("");
      return respWallet;
    } catch (err) {
      console.log("err", err);
    }
  }
  function unlockWalletHandler() {
    console.log("dispatched unlock wallet");
    dispatch({
      type: ACTION_UNLOCK_WALLET,
      payload: unlockingWallet(tempWallet),
    });
  }

  // const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  function closeHandler() {
    $modalType("");
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
          <Button className="m-2" onClick={unlockWalletHandler}>
            Unlock Wallet
          </Button>
        </span>
      </p>
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
      ) : modalType === MODAL_SAVING_WALLET ? (
        <SavingWallet actionText={actionText} />
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
