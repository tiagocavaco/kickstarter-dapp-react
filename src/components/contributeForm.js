import { useState } from 'react';
import { useGlobalContext } from '../context/store';
import useContractManager from '../hooks/useContractManager';
import useRefreshBalance from '../hooks/useRefreshBalance';
import { convertFromEtherToWei } from '../helpers/utils';
import { Button, Form, Input, Message } from 'semantic-ui-react';

const ContributeForm = (props) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { campaignContract } = useContractManager({ address: props.address });
  const { refreshBalance } = useRefreshBalance();
  const { globalState } = useGlobalContext();
  const { connected, address } = globalState;
  const { refreshCampaignSummary } = props;

  const onSubmit = async (e) => {
    console.log('CONTRIBUTE FORM SUBMITTED!');
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      await campaignContract.methods.contribute().send({ from: address, value: convertFromEtherToWei(value) });
      
      refreshCampaignSummary();
      refreshBalance();
      
      setValue('');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {      
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input label='ether' labelPosition='right' value={value} onChange={e => setValue(e.target.value)}></Input>
      </Form.Field>

      <Message error header='Oops!' content={errorMessage}></Message>

      <Button primary disabled={!connected || !campaignContract || loading} loading={loading} role='button'>Contribute</Button>
    </Form>
  )
}

export default ContributeForm;