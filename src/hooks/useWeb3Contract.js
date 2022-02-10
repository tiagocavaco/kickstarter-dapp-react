import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/store';

const useWeb3Contract = (config = {}) => {
  const [contract, setContract] = useState(null);
  const { globalState } = useGlobalContext();
  const { web3, chainId } = globalState;
  const { abi, address } = config;

  useEffect(() => {
    console.log('CHECK CONTRACT INSTANCE!');

    if (web3 && abi && address) {
      createContract();
    }
  }, [web3, chainId, abi, address]);

  const createContract = async () => {
    const code = await web3.eth.getCode(address);

    if (code != '0x') {
      console.log('CONTRACT INSTANCE CREATED:', address);

      const contract = new web3.eth.Contract(abi, address);

      setContract(contract);
    }
    else {
      setContract(null);
    }
  }

  return { contract };
}

export default useWeb3Contract;