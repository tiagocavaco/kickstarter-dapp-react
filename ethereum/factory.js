import CampaignFactory from './.deploy/CampaignFactory.json';

export const CampaignFactoryInstance = (web3) => {
  return new web3.eth.Contract(
    CampaignFactory.abi,
    CampaignFactory.address
  );
}