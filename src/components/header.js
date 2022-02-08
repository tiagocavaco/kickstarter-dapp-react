import useWeb3Modal from '../hooks/useWeb3Modal';
import { useGlobalContext } from '../context/store';
import { getChainData } from '../helpers/chains';
import { getTruncatedAddress } from '../helpers/utils';
import { Container, Grid, Button } from 'semantic-ui-react';

const Header = () => {
  const { globalState } = useGlobalContext();
  const { connected, chainId, address, balance } = globalState;

  const { connect, disconnect } = useWeb3Modal();
  const { name: networkName, native_currency: currency } = getChainData(chainId);

  return (
    <Container>
      <Grid columns={3} verticalAlign='middle'>
        <Grid.Column width={'4'}>
          <h1>THIS IS THE HEADER</h1>
        </Grid.Column>
        <Grid.Column width={'8'}>
          {connected && <h4>Connected to {networkName} with account {getTruncatedAddress(address)} and balance {balance} {currency?.symbol}</h4>}
        </Grid.Column>
        <Grid.Column width={'4'}>
          {!connected ?
            <Button positive onClick={connect} floated='right'>Connect Wallet</Button>
            :
            <Button negative onClick={disconnect} floated='right'>Disconnect Wallet</Button>
          }
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default Header;