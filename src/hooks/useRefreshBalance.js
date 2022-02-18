import { useGlobalContext } from '@context/store';
import { getEtherBalance } from '@helpers/utils';

const useRefreshBalance = (config = {}) => {
  const { globalState, dispatch } = useGlobalContext();
  const { web3, address } = globalState;

  const refreshBalance = async () => {
    const balance = await web3.eth.getBalance(address);
      
    dispatch({
      type: 'SET_GLOBAL_STATE',
      values: {
        balance: getEtherBalance(balance),
      },
    });
  }

  return { refreshBalance };
}

export default useRefreshBalance;