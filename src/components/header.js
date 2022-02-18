import Link from 'next/link';
import useWeb3Modal from '../hooks/useWeb3Modal';
import { useGlobalContext } from '../context/store';
import { getChainData } from '../helpers/chains';
import { getTruncatedAddress } from '../helpers/utils';
import { Menu, Button, Label, Icon } from 'semantic-ui-react';

const Header = () => {
  const { globalState } = useGlobalContext();
  const { connected, chainId, address, balance } = globalState;

  const { connect, disconnect } = useWeb3Modal();
  const { name: networkName, native_currency: currency } = getChainData(chainId);

  return (
    <Menu stackable>
      <Menu.Item header name='home' style={{ justifyContent: 'center' }}>
        <Link href='/'><a><strong>Kickstarter</strong></a></Link>
      </Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item style={{ justifyContent: 'center' }}>
          {!connected ?
            <Button basic color='blue' onClick={connect}>Connect Wallet</Button>
            :
            <>
              <Button as='div' labelPosition='left'>
                <Label as='span' horizontal>
                  {getTruncatedAddress(address)}
                  <Label.Detail>
                    <Label circular color={'black'} size='mini'>
                      {networkName}
                    </Label>
                  </Label.Detail>
                </Label>
                <Label as='span' basic>
                  {balance} {currency?.symbol}
                </Label>
                <Button basic color='red' onClick={disconnect} icon>
                  <Icon name='user close' />
                </Button>
              </Button>
            </>
          }
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}

export default Header;