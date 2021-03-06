// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./CampaignDeployer.sol";

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint256 minimumContribution) public {
      address newCampaign = CampaignDeployer.createCampaign(minimumContribution);

      deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[] memory) {
      return deployedCampaigns;
  }
}
