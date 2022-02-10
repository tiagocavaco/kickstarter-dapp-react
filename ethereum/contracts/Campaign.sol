// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Campaign {

    struct Request {
        string description; // describes why the request is being created
        uint256 value;  // amount of ether that the manager wants to send to the vendor
        address payable recipient; // address that the ether will be sent to
        bool complete;   // true if the request has already been processed
        mapping(address => bool) approvals; // tracks who has voted
        uint256 approvalCount; // tracks number of approvals
    }

    address public manager;

    uint256 public minimumContribution;

    mapping(address => bool) public approvers;

    uint256 public approversCount;

    Request[] public requests;

    modifier restricted(){
        require(msg.sender == manager, "Only manager can execute this function");
        _;
    }

    constructor(uint256 minimum, address creator){
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
      bool alreadyApprover = approvers[msg.sender];

      if (!alreadyApprover) {
        require(msg.value > minimumContribution, "Value should be greater than minimum contribution");

        approvers[msg.sender] = true;
        approversCount++;
      }
    }

    function createRequest(string calldata description, uint256 value, address payable recipient) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "Sender is not an approver");
        require(!request.approvals[msg.sender], "Sender already voted on this request");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(!request.complete, "Request is already completed");
        require(request.approvalCount > (approversCount / 2), "Not enough contributors have approved this request");

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view 
      returns (
        uint256, 
        uint256, 
        uint256, 
        uint256, 
        address
      ) 
    {
        return (
          minimumContribution,
          address(this).balance,
          requests.length,
          approversCount,
          manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}