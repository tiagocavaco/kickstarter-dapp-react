export const initialState = {
  provider: null,
  web3: null,
  connected: false,
  address: null,
  balance: 0,
  chainId: null,
  campaignFactoryInstance: null,
  campaignFactoryAddress: null,
  persistenceType: 'none', //'sessionStorage',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_WEB3':
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
    case 'RESET_WEB3':
      return {
        ...initialState,
        persistenceType: state.persistenceType
      }
    case 'SET_CONTRACT_INSTANCE':
      return {
        ...state,
        campaignFactoryInstance: action.campaignFactoryInstance,
        campaignFactoryAddress: action.campaignFactoryAddress,
      }
    case 'INIT_STATE':
      return action.value
    case 'PURGE_STATE':
      return initialState;
    default:
      return state;
  }
};