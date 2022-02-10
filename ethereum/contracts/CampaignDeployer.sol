// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./campaign.sol";

library CampaignDeployer{
    function createCampaign(uint256 minimumContribution) public returns(address) {
        return address(new Campaign(minimumContribution, msg.sender));
    }
}
