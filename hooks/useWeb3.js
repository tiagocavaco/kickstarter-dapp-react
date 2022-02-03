import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/store';
import Web3 from "web3";

const useWeb3 = (config = {}) => {
  const [web3, setWeb3] = useState(null);
  const { globalState, dispatch } = useGlobalContext();
  const { provider } = globalState;

  useEffect(() => {
    console.log('CHECK WEB3 INSTANCE!');

    if (provider) {
      console.log('WEB3 INSTANCE CREATED!');

      const web3 = new Web3(provider);

      setWeb3(web3);
    }
  }, [provider]);

  return { web3 };
}

export default useWeb3;