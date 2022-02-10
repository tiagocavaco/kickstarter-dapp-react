import { useState, useEffect } from 'react';
import { useGlobalContext } from '../../../context/store';
import useContractManager from '../../../hooks/useContractManager';
import { Container, Card } from 'semantic-ui-react';

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
      const { '0': minimumContribution, '1': balance, '2': requestCount, '3': approversCount, '4': manager } = await campaignContract.methods.getSummary().call();

      setCampaignSummary({
        minimumContribution,
        balance,
        requestCount,
        approversCount,
        manager
      });
    }
  }

  const renderCards = () => {
    if (!campaignSummary) {
      return;
    }

    const { minimumContribution, balance, requestCount, approversCount, manager } = campaignSummary;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      }
    ];

    return <Card.Group items={items}></Card.Group>
  }

  return (
    <Container>
      <h3>Campaign Show</h3>
      {renderCards()}
    </Container>
  )
}

Index.getInitialProps = async ({ query }) => {
  return {
    address: query.address
  }
}

export default Index;