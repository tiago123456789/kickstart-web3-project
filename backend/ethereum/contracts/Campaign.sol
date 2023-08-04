pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint mininumContribution) public {
        address campaignDeployed = new Campaign(
            mininumContribution,
            msg.sender
        );
        deployedCampaigns.push(campaignDeployed);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipeint;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public mininumContribution;
    mapping(address => bool) public approvers;
    uint public approvelsCount;

    constructor(uint mininumValue, address owner) public {
        manager = owner;
        mininumContribution = mininumValue;
    }

    function getTotalRequests() public view returns(uint) {
        return requests.length;
    }
    
    function contribute() public payable {
        require(msg.value >= mininumContribution);
        approvers[msg.sender] = true;
        approvelsCount++;
    }

    function createRequest(
        string description,
        uint value,
        address recipeint
    ) public hasOnlyOwner {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipeint: recipeint,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public hasOnlyOwner {
        Request storage request = requests[index];
        require((request.approvalCount > (approvelsCount / 2)));
        require(!request.complete);

        request.recipeint.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address) {
        return (
            mininumContribution,
            this.balance,
            requests.length,
            approvelsCount,
            manager
        );
    }

    modifier hasOnlyOwner() {
        require(manager == msg.sender);
        _;
    }
}
