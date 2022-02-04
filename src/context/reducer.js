export const initialState = {
  connected: false,
  provider: null,
  web3: null,
  chainId: null,
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