import { useState } from 'react';
import { useGlobalContext } from '../../context/store';
import useContractManager from '../../hooks/useContractManager';
import { Container, Form, Input, Button, Message } from 'semantic-ui-react';
import { Router } from '../../routes';

const New = () => {
  const [minimumContribution, setMinimumContribution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { campaignFactoryContract } = useContractManager();
  const { globalState } = useGlobalContext();
  const { connected, address } = globalState;

  const onSubmit = async (e) => {
    console.log('Submitted');
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      await campaignFactoryContract.methods.createCampaign(minimumContribution).send({ from: address });

      Router.pushRoute('/');
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

        <Button primary disabled={!connected} loading={loading} role='button'>Create</Button>
      </Form>
    </Container>
  )
}

export default New;