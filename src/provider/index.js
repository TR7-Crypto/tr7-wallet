import React, { createContext, useReducer } from "react";

const initialSate = {
  loginStatus: false,
  wallet: null,
};

export const store = createContext(initialSate);

const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    const currentState = { ...state };
    switch (action.type) {
      case "SAVE_NEW_WALLET":
      case "IMPORT_WALLET":
        if (action.payload !== undefined) {
          currentState.wallet = action.payload;
          currentState.loginStatus = true;
        }
        // TODO: save to device storage
        return currentState;

      case "LOCK_WALLET":
        currentState.wallet = null;
        currentState.loginStatus = false;
        return currentState;

      case "UNLOCK_WALLET":
        const passPhrase = action.payload;
        // TODO: load from device storage
        return currentState;

      default:
        throw new Error();
    }
  }, initialSate);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
export default StateProvider;
