import Web3 from "web3";

const httpProvider = new Web3.providers.HttpProvider(process.env.INFURA_PROVIDER_URL);

export const initialState = {
  connected: false,
  provider: httpProvider,
  web3:  new Web3(httpProvider),
  chainId: 4,
  address: null,
  balance: 0,
  persistenceType: 'sessionStorage', //'sessionStorage',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_GLOBAL_STATE':
      return {
        ...state,
        ...action.values
      }
    case 'PURGE_GLOBAL_STATE':
      return initialState;
    default:
      return state;
  }
};

export const stateToJSON = (state) => {
  const jsonStringifyReplacer = (key, value) => {
    switch (key) {
      case 'connected':
      case 'provider':
      case 'web3':
        return undefined;
      default:
        return value;
    }
  };
  
  return JSON.stringify(state, jsonStringifyReplacer);
}