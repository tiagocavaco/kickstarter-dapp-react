import { useState } from 'react';
import { useGlobalContext } from '../context/store';
import useContractManager from '../hooks/useContractManager';
import useRefreshBalance from '../hooks/useRefreshBalance';
import { getEtherBalance } from '../helpers/utils';
import { Button, Table, Label } from 'semantic-ui-react';

const RequestRow = (props) => {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingFinalize, setLoadingFinalize] = useState(false);
  const { campaignContract } = useContractManager({ address: props.address });
  const { refreshBalance } = useRefreshBalance();
  const { globalState } = useGlobalContext();
  const { connected, address } = globalState;
  const { id, request, approversCount, refreshRequests } = props;
  const readyToFinalize = request.approvalCount > (approversCount / 2);

  const onApprove = async () => {
    setLoadingApprove(true);

    try {
      await campaignContract.methods
        .approveRequest(id)
        .send({ from: address });

      refreshRequests();
    } catch (err) {
      console.log(err);
    } finally {
      refreshBalance();

      setLoadingApprove(false);
    }
  };

  const onFinalize = async () => {
    setLoadingFinalize(true);

    try {
      await campaignContract.methods
        .finalizeRequest(id)
        .send({ from: address });

      refreshRequests();
    } catch (err) {
      console.log(err);
    } finally {
      refreshBalance();

      setLoadingFinalize(false);
    }
  };

  return (
    <Table.Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Table.Cell>
        <Label ribbon>{request.description}</Label>
      </Table.Cell>
      <Table.Cell>
        <Label color='yellow'>
          {getEtherBalance(request.value)}
          <Label.Detail>ETH</Label.Detail>
        </Label>
      </Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>
        <Label circular basic>
          {request.approvalCount}/{approversCount}
        </Label>
      </Table.Cell>
      <Table.Cell>
        {!request.complete && (
          <Button disabled={!connected || !campaignContract || loadingFinalize || loadingApprove || readyToFinalize} loading={loadingApprove} primary fluid onClick={onApprove}>
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {!request.complete && (
          <Button disabled={!connected || !campaignContract || loadingApprove || loadingFinalize || !readyToFinalize} loading={loadingFinalize} secondary fluid onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}

export default RequestRow;