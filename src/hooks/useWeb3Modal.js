import { useState, useCallback, useEffect } from 'react';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { useGlobalContext } from '@context/store';
import { providerOptions } from '@helpers/providers';
import { supportedChains, getChainData } from '@helpers/chains';
import { getEtherBalance } from '@helpers/utils';

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

      const chainId = await web3.eth.getChainId();
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const balance = await web3.eth.getBalance(address);

      dispatch({
        type: 'SET_GLOBAL_STATE',
        values: {
          connected: true,
          provider,
          web3,
          chainId,
          address,
          balance: getEtherBalance(balance),
        },
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
      type: 'PURGE_GLOBAL_STATE',
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
    console.log('CHECK LISTENERS!');

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
            type: 'SET_GLOBAL_STATE',
            values: {
              address,
              balance: getEtherBalance(balance),
            },
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
        // window.location.reload();

        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const balance = await web3.eth.getBalance(address);

        dispatch({
          type: 'SET_GLOBAL_STATE',
          values: {
            chainId: Web3.utils.hexToNumber(chainId),
            address,
            balance: getEtherBalance(balance),
          },
        });
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
    console.log('CHECK CHAIN IS VALID!');

    if (provider?.isMetaMask && chainId) {
      const chain = getChainData(chainId);

      if (!chain.enabled) {
        console.log('SWITCH TO VALID CHAIN!');

        const defaultChain = supportedChains.find(chain => chain.default);
        const defaultChainId = Web3.utils.toHex(defaultChain.chain_id);

        provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: defaultChainId }] });
      }
    }
  }, [provider, chainId]);

  return { connect, disconnect };
}

export default useWeb3Modal;