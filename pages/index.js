import { useEffect } from 'react';

import Web3 from "web3";
import { CampaignFactoryInstance } from '../ethereum/factory';
import useWeb3Modal from '../hooks/useWeb3Modal';
import { useGlobalContext } from '../context/store';

const Index = () => {
  const { globalState, dispatch } = useGlobalContext();
  const { web3, connected, address, balance, chainId, campaignFactoryInstance, campaignFactoryAddress } = globalState;

  const [connect, disconnect, switchChain, connectedChain] = useWeb3Modal();
  const { name: networkName } = connectedChain();

  useEffect(() => {
    console.log('INIT CONTRACT INSTANCE!');

    if (web3) {
      console.log('CONTRACT INSTANCE CREATED!');
      const campaignFactoryInstance = CampaignFactoryInstance(web3);
      const campaignFactoryAddress = campaignFactoryInstance.options.address;

      dispatch({
        type: 'SET_CONTRACT_INSTANCE',
        campaignFactoryInstance,
        campaignFactoryAddress,
      });
    }
  }, [web3]);

  return (
    <div className='main-app'>
      <h1>This is the campaign list page!!!</h1>
      <div>
        {!connected &&
          <button onClick={connect} className='cta-button connect-wallet-button'>
            Connect Wallet
          </button>
        }
      </div>
      <div>
        {connected &&
          <button onClick={disconnect} className='cta-button connect-wallet-button'>
            Disconnect Wallet
          </button>
        }
      </div>
      {connected && <h3>You are connected to {networkName} with account {address} and balance {balance} ETH</h3>}
      {connected && campaignFactoryAddress && <div><h4>Contract address - {campaignFactoryAddress}</h4></div>}
    </div>
  )
}

export default Index;