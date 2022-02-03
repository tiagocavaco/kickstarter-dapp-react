import useWeb3Modal from '../hooks/useWeb3Modal';
import { useGlobalContext } from '../context/store';

const Header = () => {
  const { globalState, dispatch } = useGlobalContext();
  const { connected, address, balance } = globalState;

  const { connect, disconnect, switchChain, connectedChain } = useWeb3Modal();
  const { name: networkName } = connectedChain();

  return (
    <>
      <h1>THIS IS THE HEADER</h1>
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
    </>
  )
}

export default Header;