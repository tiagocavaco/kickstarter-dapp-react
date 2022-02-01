import { useState, useEffect } from 'react';
import Web3 from "web3";
import useWeb3Modal from '../hooks/useWeb3Modal';

function App() {

  const { connected, address, balance, connect, disconnect, connectedChain } = useWeb3Modal();

  const { name: networkName } = connectedChain();

  return (
    <>
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
      </div>

      <style>{`
        html,
        body {
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>

  )
}

export default App;