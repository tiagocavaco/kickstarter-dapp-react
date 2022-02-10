import { useState } from 'react';
import { useRouter } from 'next/router';
import { useGlobalContext } from '../../context/store';
import useContractManager from '../../hooks/useContractManager';
import useRefreshBalance from '../../hooks/useRefreshBalance';
import { Container, Form, Input, Button, Message } from 'semantic-ui-react';

const New = () => {
  const router = useRouter();
  
  const [minimumContribution, setMinimumContribution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { campaignFactoryContract } = useContractManager();
  const { refreshBalance } = useRefreshBalance();
  const { globalState } = useGlobalContext();
  const { connected, address } = globalState;

  const onSubmit = async (e) => {
    console.log('Submitted');
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      await campaignFactoryContract.methods.createCampaign(minimumContribution).send({ from: address });

      await refreshBalance();

      router.push('/');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h3>Create a Campaign</h3>

      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input label='wei' labelPosition='right' value={minimumContribution} onChange={e => setMinimumContribution(e.target.value)}></Input>
        </Form.Field>

        <Message error header='Oops!' content={errorMessage}></Message>

        <Button primary disabled={!connected || !campaignFactoryContract} loading={loading} role='button'>Create</Button>
      </Form>
    </Container>
  )
}

export default New;