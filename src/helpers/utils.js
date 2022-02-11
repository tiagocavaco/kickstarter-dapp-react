import Web3 from "web3";

export const getEtherBalance = (balance) => parseFloat(Web3.utils.fromWei(balance, "ether")).toFixed(3);

export const convertFromEtherToWei = (value) => Web3.utils.toWei(value, 'ether');

export const getTruncatedAddress = (address) => {
  let startStr = address.substring(0, 5);
  let endStr = address.substring(address.length - 4, address.length);

  return `${startStr}...${endStr}`;
}