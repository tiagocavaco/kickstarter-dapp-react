// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./campaign.sol";

library CampaignDeployer{
    function createCampaign(uint minimum) public returns(address) {
        return address(new Campaign(minimum, msg.sender));
    }
}
