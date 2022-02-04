import Web3 from "web3";

export const getEtherBalance = (balance) => parseFloat(Web3.utils.fromWei(balance, "ether")).toFixed(4);