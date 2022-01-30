import { useState, useEffect } from 'react';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { getChainData } from "../ethereum//helpers/utils";
import WalletConnect from "@walletconnect/web3-provider";

function App() {

  const [web3Modal, setWeb3Modal] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [chainId, setChainId] = useState(4);

  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: process.env.INFURA_ID
      }
    },
  };

  const getNetwork = () => getChainData(chainId).network;

  const connectWalletHandler = async () => {
    try {
      const provider = await web3Modal.connect();

      await subscribeProvider(provider);

      await provider.enable();

      const web3 = new Web3(provider);

      await web3.currentProvider.request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x4'}]});
      
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const balance = await web3.eth.getBalance(address);
      const chainId = await web3.eth.getChainId();
 
      setWeb3(web3);
      setAddress(accounts[0]);
      setBalance(parseFloat(Web3.utils.fromWei(balance, "ether")).toFixed(4));
      setChainId(chainId);
      setConnected(true);
    }
    catch (err) {
      console.log(err);
    }
  }

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("connect", (info) => {
      console.log("CONNECT: " + info);
      setChainId(info.chainId);
    });
    provider.on("disconnect", (error) => {
      console.log("DISCONNECT: " + error);
      resetApp();
    });
    provider.on("accountsChanged", (accounts) => {
      console.log("ACCOUNTS CHANGED: " + accounts);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        resetApp();
      }
    });
    provider.on("chainChanged", (chainId) => {
      console.log("CHAIN CHANGED: " +  chainId);
      setChainId(Web3.utils.hexToNumber(chainId));
    });
  };

  const resetApp = async () => {
    console.log("RESET!");

    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();

    setWeb3(null);
    setConnected(false);
    setAddress("");
    setBalance(0);
  };

  useEffect(() => {
    console.log('INIT MODAL!');

    const web3Modal = new Web3Modal({
      network: getNetwork(), // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    setWeb3Modal(web3Modal);
  }, []);

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      console.log('CACHE!');
      connectWalletHandler();
    }
  }, [web3Modal]);

  const connectedNetwork = () => {
    let networkName = "";

    if (chainId) {
      try {
        networkName = getChainData(chainId).name
      } catch (err) {
        console.log("ChainId not valid: " + chainId);
      }
    }

    return networkName;
  }

  return (
    <div className='main-app'>
      <h1>This is the campaign list page!!!</h1>
      <div>
        {!connected &&
          <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
            Connect Wallet
          </button>
        }
      </div>
      <div>
        {connected &&
          <button onClick={resetApp} className='cta-button connect-wallet-button'>
            Disconnect Wallet
          </button>
        }
      </div>
      {connected && <h3>You are connected to {connectedNetwork()} with account {address} and balance {balance} ETH</h3>}
    </div>
  )
}

export default App;