export const initialState = {
  provider: null,
  web3: null,
  connected: false,
  address: null,
  balance: 0,
  chainId: null,
  persistenceType: 'none', //'sessionStorage',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONNECTED':
      return {
        ...state,
        connected: action.connected,
        provider: action.provider,
        web3: action.web3,
        address: action.address,
        balance: action.balance,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
        balance: action.balance,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_CONNECTION':
      return {
        ...initialState,
      }
    case 'INIT_STATE':
      return action.value
    case 'PURGE_STATE':
      return initialState;
    default:
      return state;
  }
};