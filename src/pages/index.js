import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '../context/store';
import useContractManager from '../hooks/useContractManager';
import { Container, Card, Button } from 'semantic-ui-react';

const Index = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { campaignFactoryContract } = useContractManager();
  const { globalState } = useGlobalContext();
  const { connected } = globalState;

  useEffect(() => {
    getDeployedCampaigns();
  }, [campaignFactoryContract]);

  const getDeployedCampaigns = async () => {
    console.log('GET DEPLOYED CAMPAIGNS');
    if (campaignFactoryContract) {
      console.log('SET CAMPAIGNS');
      const campaigns = await campaignFactoryContract.methods.getDeployedCampaigns().call();

      setCampaigns(campaigns);
    }
  }

  const renderCampaigns = () => {
    const items = campaigns.map(address => {
      return {
        header: address,
        description: <Link href={`/campaigns/${address}`}><a>View Campaign</a></Link>,
        fluid: true
      }
    });

    return <Card.Group items={items}></Card.Group>
  }

  return (
    <Container>
      <h3>Open Campaigns</h3>

      <Link href='/campaigns/new'>
        <a>
          <Button content='Create Campaign' icon='add circle' primary={true} floated='right'></Button>
        </a>
      </Link>

      {renderCampaigns()}
    </Container>
  )
}

export default Index;