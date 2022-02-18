import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '../../../../context/store';
import useContractManager from '../../../../hooks/useContractManager';
import RequestRow from '../../../../components/requestRow';
import { Container, Button, Table, Dimmer, Loader, Segment } from 'semantic-ui-react';

const Index = (props) => {
  const [requests, setRequests] = useState([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [approversCount, setApproversCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { campaignContract } = useContractManager({ address: props.address });
  const { globalState } = useGlobalContext();
  const { connected } = globalState;

  useEffect(() => {
    getRequests();
  }, [campaignContract]);

  const getRequests = async () => {
    console.log('GET CAMPAIGN REQUESTS');
    if (campaignContract) {
      console.log('SET CAMPAIGN REQUESTS');

      setLoading(true);

      try {
        const requestsCount = await campaignContract.methods.getRequestsCount().call();
        const approversCount = await campaignContract.methods.approversCount().call();

        const requests = await Promise.all(
          Array(parseInt(requestsCount))
            .fill()
            .map((_, index) =>
              campaignContract.methods.requests(index).call()
            )
        );

        setRequestsCount(requestsCount);
        setApproversCount(approversCount);
        setRequests(requests);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  const renderRows = () => {
    return requests.map((request, index) => (
      <RequestRow
        key={index}
        id={index}
        request={request}
        address={props.address}
        approversCount={approversCount}
        refreshRequests={getRequests}
      />
    ));
  };

  return (
    <Container>
      <Link href={`/campaigns/${props.address}`}>
        <a>&#60; Back</a>
      </Link>

      <h3>Campaign Requests</h3>

      <Link href={`/campaigns/${props.address}/requests/new`}>
        <a>
          <Button primary>Create Request</Button>
        </a>
      </Link>

      <div style={{ position: 'relative' }}>
        <Dimmer active={loading} inverted>
          <Loader></Loader>
        </Dimmer>

        <Table striped basic='very' >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Recipient</Table.HeaderCell>
              <Table.HeaderCell>Approval Count</Table.HeaderCell>
              <Table.HeaderCell colSpan='2'>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {renderRows()}
          </Table.Body>
        </Table>
        <div>Found <strong>{requestsCount}</strong> requests.</div>
      </div>

    </Container>
  )
}

Index.getInitialProps = async ({ query }) => {
  return {
    address: query.address
  }
}

export default Index;