import { useState } from 'react';
import { useGlobalContext } from '../../context/store';
import useContractManager from '../../hooks/useContractManager';
import { Container } from 'semantic-ui-react';

const Show = () => {
  const { campaignFactoryContract } = useContractManager();
  const { globalState } = useGlobalContext();
  const { connected, address } = globalState;

  return (
    <Container>
      <h3>Campaign Show</h3>
    </Container>
  )
}

export default Show;