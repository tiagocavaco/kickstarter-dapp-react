import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/store';
import useContractManager from '../hooks/useContractManager';
import { Container } from 'semantic-ui-react';

const Index = () => {
  const { campaignFactoryContract } = useContractManager();
  const { globalState } = useGlobalContext();
  const { connected } = globalState;

  useEffect(() => {
    console.log('GET DEPLOYED CAMPAIGNS:', campaignFactoryContract);
    if (campaignFactoryContract) {
      getDeployedCampaigns();
    }
  }, [campaignFactoryContract]);

  const getDeployedCampaigns = async () => {
    const campaigns = await campaignFactoryContract.methods.getDeployedCampaigns().call();

    console.log(campaigns);
  }

  return (
    <Container>
      <h1>This is the campaign list page!!!</h1>
      {campaignFactoryContract && <div><h4>Contract address - {campaignFactoryContract.options.address}</h4></div>}
    </Container>
  )
}

export default Index;