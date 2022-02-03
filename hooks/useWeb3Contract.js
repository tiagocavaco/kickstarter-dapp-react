import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/store';

const useWeb3Contract = (config = {}) => {
  const [contract, setContract] = useState(null);
  const { globalState, dispatch } = useGlobalContext();
  const { web3 } = globalState;
  const { abi, address } = config;

  useEffect(() => {
    console.log('CHECK CONTRACT INSTANCE!');

    if (web3) {
      console.log('CONTRACT INSTANCE CREATED!');

      const contract = new web3.eth.Contract(abi, address);

      setContract(contract);
    }
  }, [web3]);

  return { contract };
}

export default useWeb3Contract;