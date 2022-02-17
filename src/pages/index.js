import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '../context/store';
import useContractManager from '../hooks/useContractManager';
import { Container, Card, Button, Grid } from 'semantic-ui-react';

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
        style: { overflowWrap: 'break-word', margin: '0.875em 0' },
      }
    });

    return <Card.Group items={items} itemsPerRow={1} centered={true}></Card.Group>
  }

  return (
    <Container>
      <h3>Open Campaigns</h3>

      <Grid columns={2} reversed='computer'>
        <Grid.Column computer={'3'} mobile={'16'} >
          <Link href='/campaigns/new'>
            <a>
              <Button content='Create Campaign' icon='add circle' primary={true} fluid={true}></Button>
            </a>
          </Link>
        </Grid.Column>
        <Grid.Column computer={'13'} mobile={'16'}>
          {renderCampaigns()}
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default Index;