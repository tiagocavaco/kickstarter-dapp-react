import { useGlobalContext } from '../context/store';
import useContractManager from '../hooks/useContractManager';
import useRefreshBalance from '../hooks/useRefreshBalance';
import { Button, Table } from 'semantic-ui-react';
import { getEtherBalance } from '../helpers/utils';

const RequestRow = (props) => {
  const { campaignContract } = useContractManager({ address: props.address });
  const { refreshBalance } = useRefreshBalance();
  const { globalState } = useGlobalContext();
  const { connected, address } = globalState;
  const { id, request, approversCount, refreshRequests } = props;
  const readyToFinalize = request.approvalCount > (approversCount / 2);

  const onApprove = async () => {
    await campaignContract.methods
      .approveRequest(id)
      .send({ from: address });

    refreshRequests();
    refreshBalance();
  };

  const onFinalize = async () => {
    await campaignContract.methods
      .finalizeRequest(id)
      .send({ from: address });

    refreshRequests();
    refreshBalance();
  };

  return (
    <Table.Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{getEtherBalance(request.value)} (eth)</Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>
        {request.approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell>
        {!request.complete && (
          <Button disabled={!connected || !campaignContract} color='green' basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {!request.complete && (
          <Button disabled={!connected || !campaignContract} color='teal' basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}

export default RequestRow;