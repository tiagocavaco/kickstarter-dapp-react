import { useState, useEffect } from 'react';
import { useGlobalContext } from '../../../context/store';
import useContractManager from '../../../hooks/useContractManager';
import { Container, Card, Grid } from 'semantic-ui-react';
import { getEtherBalance } from '../../../helpers/utils';
import ContributeForm from '../../../components/contributeForm';

const Index = (props) => {
  const [campaignSummary, setCampaignSummary] = useState(null);
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
      const { '0': minimumContribution, '1': balance, '2': requestsCount, '3': approversCount, '4': manager } = await campaignContract.methods.getSummary().call();

      setCampaignSummary({
        minimumContribution,
        balance,
        requestsCount,
        approversCount,
        manager
      });
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

    return <Card.Group items={items} itemsPerRow={2} doubling={true}></Card.Group>
  }

  return (
    <Container>
      <h3>Campaign Show</h3>
      <Grid columns={2} reversed='computer'>
        <Grid.Column computer={'6'} width={'16'} >
          <ContributeForm address={props.address} refreshCampaignSummary={getCampaignSummary}></ContributeForm>
        </Grid.Column>
        <Grid.Column computer={'10'} width={'16'}>
          {renderCards()}
        </Grid.Column>
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