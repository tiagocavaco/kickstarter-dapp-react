import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useGlobalContext } from '../../../../context/store';
import useContractManager from '../../../../hooks/useContractManager';
import useRefreshBalance from '../../../../hooks/useRefreshBalance';
import { convertFromEtherToWei } from '../../../../helpers/utils';
import { Container, Form, Input, Button, Message } from 'semantic-ui-react';

const New = (props) => {
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { campaignContract } = useContractManager({ address: props.address });
  const { refreshBalance } = useRefreshBalance();
  const { globalState } = useGlobalContext();
  const { connected, address } = globalState;

  const onSubmit = async (e) => {
    console.log('CREATE REQUEST FORM SUBMITTED');
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      await campaignContract.methods.createRequest(description, convertFromEtherToWei(value), recipient).send({ from: address });

      refreshBalance();

      router.push(`/campaigns/${props.address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Link href={`/campaigns/${props.address}/requests`}>
        <a>&#60; Back</a>
      </Link>

      <h3>Create a Request</h3>

      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={e => setDescription(e.target.value)}></Input>
        </Form.Field>
        <Form.Field>
          <label>Value</label>
          <Input label='ether' labelPosition='right' value={value} onChange={e => setValue(e.target.value)}></Input>
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input value={recipient} onChange={e => setRecipient(e.target.value)}></Input>
        </Form.Field>

        <Message error header='Oops!' content={errorMessage}></Message>

        <Button primary disabled={!connected || !campaignContract || loading} loading={loading}>Create</Button>
      </Form>
    </Container>
  )
}

New.getInitialProps = async ({ query }) => {
  return {
    address: query.address
  }
}

export default New;