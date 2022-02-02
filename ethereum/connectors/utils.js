import { supportedChains }  from "./chains";

export function getChainData(chainId) {
  const chainData = supportedChains.filter((chain) => chain.chain_id === chainId)[0];

  if (chainData) {
    const API_KEY = process.env.INFURA_ID;

    if (
      chainData.rpc_url.includes("infura.io") &&
      chainData.rpc_url.includes("%API_KEY%") &&
      API_KEY
    ) {
      const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);

      return {
        ...chainData,
        rpc_url: rpcUrl
      };
    }
  }

  return chainData;
}