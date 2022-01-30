import web3 from './web3';
import CampaignFactory from './.deploy/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  CampaignFactory.address
);

export default instance;