import useWeb3Contract from '@hooks/useWeb3Contract';
import { contracts } from '@helpers/contracts';

const useContractManager = (config = {}) => {
  const { contract: campaignFactoryContract } = useWeb3Contract({ abi: contracts.campaignFactory.abi, address: contracts.campaignFactory.address });

  const { contract: campaignContract } = useWeb3Contract({ abi: contracts.campaign.abi, address: config.address }); 

  return { campaignFactoryContract, campaignContract };
}

export default useContractManager;