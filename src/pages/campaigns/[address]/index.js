import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '@context/store';
import useContractManager from '@hooks/useContractManager';
import { getEtherBalance } from '@helpers/utils';
import ContributeForm from '@components/contributeForm';
import { Container, Card, Grid, Button, Dimmer, Loader } from 'semantic-ui-react';

const Index = (props) => {
  const [campaignSummary, setCampaignSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { campaignContract } = useContractManager({ address: props.address });
  const { globalState } = useGlobalContext();
  const { connected } = globalState;

  useEffect(() => {
    getCampaignSummary();
  }, [campaignContract]);

  const getCampaignSummary = async () => {
    console.log('GET CAMPAIGN SUMMARY');
    if (campaignContract) {
      console.log('SET CAMPAIGN SUMMARY');

      setLoading(true);

      try {
        const { '0': minimumContribution, '1': balance, '2': requestsCount, '3': approversCount, '4': manager } = await campaignContract.methods.getSummary().call();

        setCampaignSummary({
          minimumContribution,
          balance,
          requestsCount,
          approversCount,
          manager
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  const renderCards = () => {
    if (!campaignSummary) {
      return;
    }

    const { minimumContribution, balance, requestsCount, approversCount, manager } = campaignSummary;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money ',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to become an approver',
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Request must be approved by approvers',
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description:
          'Number of people who have already donated to this campaign',
      },
      {
        header: getEtherBalance(balance),
        meta: 'Campaign Balance (ether)',
        description:
          'The balance is how much money this campaign has left to spend',
      },
    ];

    return <Card.Group items={items} itemsPerRow={2} doubling></Card.Group>
  }

  return (
    <Container>
      <Link href='/'>
        <a>&#60; Back</a>
      </Link>

      <h3>Campaign</h3>

      <Grid reversed='computer'>
        <Grid.Column computer={'6'} mobile={'16'} >
          <ContributeForm address={props.address} refreshCampaignSummary={getCampaignSummary}></ContributeForm>
        </Grid.Column>
        <Grid.Column computer={'10'} mobile={'16'}>
          <Dimmer active={loading} inverted>
            <Loader></Loader>
          </Dimmer>

          {renderCards()}
        </Grid.Column>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${props.address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

Index.getInitialProps = async ({ query }) => {
  return {
    address: query.address
  }
}

export default Index;