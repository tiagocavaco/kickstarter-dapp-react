// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./CampaignDeployer.sol";

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint256 minimum) public {
    address newCampaign = CampaignDeployer.createCampaign(minimum);

    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[] memory) {
    return deployedCampaigns;
  }
}
