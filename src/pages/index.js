import { useGlobalContext } from '../context/store';
import useContractManager from '../hooks/useContractManager';

const Index = () => {
  const { campaignFactoryContract } = useContractManager();
  const { globalState, dispatch } = useGlobalContext();
  const { connected } = globalState;

  return (
    <div className='main-app'>
      <h1>This is the campaign list page!!!</h1>
      {connected && campaignFactoryContract && <div><h4>Contract address - {campaignFactoryContract.options.address}</h4></div>}
    </div>
  )
}

export default Index;