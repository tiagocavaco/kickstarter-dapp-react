import useWeb3Contract from './useWeb3Contract';
import { contracts } from '../helpers/contracts';

const useContractManager = (config = {}) => {
  const { contract: campaignFactoryContract } = useWeb3Contract({ abi: contracts.campaignFactory.abi, address: contracts.campaignFactory.address });

  return { campaignFactoryContract };
}

export default useContractManager;