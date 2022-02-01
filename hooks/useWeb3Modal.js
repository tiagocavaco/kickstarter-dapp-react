import { useState, useCallback, useEffect, useReducer } from 'react';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { getChainData } from "../helpers/utils";
import WalletConnect from "@walletconnect/web3-provider";
import WalletLink from "walletlink";

const useWeb3Modal = () => {
  const defaultChainId = 4;

  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: process.env.INFURA_ID
      }
    },
    walletlink: {
      package: WalletLink,
      options: {
        appName: "Kickstarter App",
        infuraId: process.env.INFURA_ID
      }
    }, 
    binancechainwallet: {
      package: true
    },
    'custom-trust-wallet': {
      display: {
        logo: "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxNTguOCAxODQiIHZpZXdCb3g9IjAgMCAxNTguOCAxODQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzU0IDM1MSkiPjxwYXRoIGQ9Im0tMjc0LjYtMzQzLjdjMjkuMyAyMi43IDYyLjkgMjEuMyA3Mi41IDIxLjMtMi4xIDEyOS4xLTE4LjEgMTExLjktNzIuNSAxNDguMS01NC40LTM2LjItNzAuMy0xOS03Mi40LTE0OC4xIDkuNSAwIDQzIDEuNCA3Mi40LTIxLjN6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibS0yNzQuNi0zNDMuNyA0LjItNS41Yy0yLjUtMS45LTYtMS45LTguNSAwem03Mi41IDIxLjMgNi45LjFjMC0xLjktLjctMy42LTItNS0xLjMtMS4zLTMuMS0yLjEtNC45LTIuMXptLTcyLjUgMTQ4LjEtMy44IDUuOGMyLjMgMS41IDUuMyAxLjUgNy43IDB6bS03Mi40LTE0OC4xdi02LjljLTEuOSAwLTMuNi43LTQuOSAyLjEtMS4zIDEuMy0yIDMuMS0yIDV6bTY4LjEtMTUuOGMzMS40IDI0LjMgNjcuMyAyMi43IDc2LjcgMjIuN3YtMTMuOGMtOS44IDAtNDEuMSAxLjItNjguMy0xOS45em02OS44IDE1LjdjLS41IDMyLjEtMS45IDU0LjgtNC41IDcxLjYtMi42IDE2LjYtNi4yIDI2LjYtMTEgMzMuNi00LjggNy4zLTEwLjggMTEuNi0xOS43IDE2LjktOSA1LjQtMjAuMyAxMS4yLTM0LjMgMjAuNGw3LjcgMTEuNWMxMy4zLTguOCAyNC4zLTE0LjUgMzMuNy0yMC4xIDkuNS01LjcgMTcuOC0xMS45IDI0LjEtMjEgNi4zLTkuNCAxMC41LTIxLjYgMTMuMi0zOS4yIDIuNy0xNy40IDQuMS00MSA0LjYtNzMuNXptLTYxLjcgMTQyLjRjLTEzLjktOS4zLTI1LjMtMTUuMS0zNC4yLTIwLjRzLTE0LjktOS42LTE5LjctMTYuOWMtNC43LTctOC40LTE2LjktMTAuOS0zMy42LTIuNi0xNi44LTMuOS0zOS40LTQuNS03MS42bC0xMy45LjNjLjUgMzIuNCAyIDU2IDQuNiA3My41IDIuNyAxNy42IDYuOCAyOS44IDEzLjEgMzkuMiA2LjMgOS4xIDE0LjYgMTUuMyAyNCAyMSA5LjQgNS42IDIwLjQgMTEuMiAzMy43IDIwLjF6bS03Ni4yLTEzNS40YzkuMyAwIDQ1LjMgMS42IDc2LjYtMjIuN2wtOC40LTExYy0yNy4yIDIxLjEtNTguNSAxOS45LTY4LjIgMTkuOXoiIGZpbGw9IiMzMzc1YmIiLz48L2c+PC9zdmc+",
        name: "Trust Wallet",
        description: "Connect with your Trust Wallet"
      },
      package: true,
      connector: async () => {
        let provider = null;
        if (typeof window.ethereum !== 'undefined') {
          provider = window.ethereum;
          try {
            await provider.request({ method: 'eth_requestAccounts' })
          } catch (error) {
            throw new Error("User Rejected");
          }
        } else if (window.web3) {
          provider = window.web3.currentProvider;
        } else if (window.celo) {
          provider = window.celo;
        } else {
          throw new Error("No Web3 Provider found");
        }
        return provider;
      }
    }
  };

  const initialState = {
    connected: false,
    provider: null,
    web3: null,
    address: null,
    balance: 0,
    chainId: defaultChainId,
  };

  const reducer = (state, action) => {
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
        return initialState
      default:
        throw new Error()
    }
  };

  const [web3Modal, setWeb3Modal] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { connected, provider, web3, address, balance, chainId } = state;

  const connect = useCallback(async function () {
    console.log("CONNECT!");

    try {
      const provider = await web3Modal.connect();

      await provider.enable();

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const balance = await web3.eth.getBalance(address);
      const chainId = await web3.eth.getChainId();

      dispatch({
        type: 'SET_WEB3',
        connected: true,
        provider,
        web3,
        address,
        balance: getEtherBalance(balance),
        chainId,
      });
    }
    catch (err) {
      console.log(err);
    }
  }, [web3Modal]);

  const disconnect = useCallback(async function () {
    console.log("DISCONNECT!");

    if (provider?.close) {
      await provider.close();
    }

    if (provider?.disconnect) {
      await provider.disconnect();
    }

    await web3Modal.clearCachedProvider();

    dispatch({
      type: 'RESET_WEB3',
    });
  }, [provider]);

  useEffect(() => {
    console.log('INIT MODAL!');

    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions // required
    });

    setWeb3Modal(web3Modal);
  }, []);

  useEffect(() => {
    console.log('CHECK CACHE!');

    if (web3Modal?.cachedProvider) {
      console.log('CACHE!');
      connect();
    }
  }, [web3Modal]);

  useEffect(() => {
    console.log('LISTENERS!');

    if (provider?.on) {
      const handleAccountsChanged = async (accounts) => {
        console.log('accountsChanged:', accounts);

        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        
        if (accounts.length > 0) {
          const address = accounts[0];
          const balance = await web3.eth.getBalance(address);

          dispatch({
            type: 'SET_ADDRESS',
            address,
            balance: getEtherBalance(balance),
          });
        } else {
          await disconnect();
        }
      };

      const handleChainChanged = async (chainId) => {
        console.log('chain changed:', chainId);

        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.

        window.location.reload();
      };

      const handleDisconnect = async (error) => {
        console.log('disconnect:', error);

        // Event occures if provider becomes unable to submit RPC requests to any chain. 
        // In general, this will only happen due to network connectivity issues or some unforeseen error.
        
        await disconnect();
      };

      console.log('ADD LISTENERS!');

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      // Subscription Cleanup when unmounting
      return () => {
        if (provider?.removeListener) {
          console.log('REMOVE LISTENERS!');

          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider]);

  useEffect(() => {
    console.log('CHECK CHAIN!');

    if (!getChainData(chainId)) {
      console.log('SWITCH CHAIN!');

      switchChain();
    }
  }, [chainId]);

  const switchChain = async () => {
    try {
      await web3.currentProvider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: Web3.utils.toHex(defaultChainId) }] });
    }
    catch (err) {
      console.log('REJECTED:', err);
    }
  };

  const connectedChain = () => {
    return getChainData(chainId) || { name: "Invalid chain" };
  };

  const getEtherBalance = (balance) => parseFloat(Web3.utils.fromWei(balance, "ether")).toFixed(4);

  return { web3, connected, chainId, address, balance, connect, disconnect, connectedChain };
}

export default useWeb3Modal;