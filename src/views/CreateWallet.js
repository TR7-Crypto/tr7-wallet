import React from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

var ethers = require("ethers");
var url = "https://mainnet.infura.io/v3/ed36ba09872245c4913d425cb97d210c";
var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
const mnemonic =
  "giggle video holiday apart praise mail broom logic accuse rough ill uncover";
// const wallet = ethers.Wallet.createRandom();
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
console.log("address:", wallet.address);
console.log("mnemonic:", wallet.mnemonic.phrase);
console.log("privateKey:", wallet.privateKey);

const CreateWallet = () => {
  const [modalShow, $modalShow] = React.useState(true);
  //generate wallet
  function nextHandler() {}
  function closeHandler() {
    $modalShow(false);
  }
  // display on modal as confirming processing

  return (
    <>
      <Modal
        // {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
        onHide={closeHandler}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            CREAT WALLET
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            WARNING!!! Please backup this 12 mnemonic words in order to restore
            your wallet later
          </p>
          <h5 className="text-primary">{mnemonic}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={nextHandler}>Next</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateWallet;
