import { useState, useCallback, useEffect } from 'react';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useGlobalContext } from '../context/store';
import { providerOptions } from '../ethereum/connectors/providers';
import { supportedChains } from '../ethereum/connectors/chains';
import { getChainData } from "../ethereum/connectors/utils";

const useWeb3Modal = (config = {}) => {
  const [web3Modal, setWeb3Modal] = useState(null);
  const { globalState, dispatch } = useGlobalContext();
  const { provider, web3, chainId } = globalState;

  const connect = useCallback(async () => {
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

  const disconnect = useCallback(async () => {
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

  const switchChain = useCallback(async (chainId) => {
    try {
      await web3.currentProvider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
    }
    catch (err) {
      console.log(err);
    }
  }, [chainId]);

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
      console.log('ADD LISTENERS!');

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

    if (chainId && !getChainData(chainId)) {
      console.log('SWITCH CHAIN!');

      const defaultChain = supportedChains.find(chain => chain.default);
      const defaultChainId = Web3.utils.toHex(defaultChain.chain_id);

      switchChain(defaultChainId);
    }
  }, [chainId]);

  const connectedChain = () => getChainData(chainId) || { name: "Invalid chain" };

  const getEtherBalance = (balance) => parseFloat(Web3.utils.fromWei(balance, "ether")).toFixed(4);

  return [connect, disconnect, switchChain, connectedChain];
}

export default useWeb3Modal;