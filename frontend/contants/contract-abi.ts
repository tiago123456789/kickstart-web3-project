
export const CAMPAING_FACTORY_ABI: { [key: string]: any }[] = [
    {
        "constant": true,
        "inputs": [{ "name": "", "type": "uint256" }],
        "name": "deployedCampaigns",
        "outputs": [{ "name": "", "type": "address" }],
        "payable": false,
        "stateMutability": "view", "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getDeployedCampaigns",
        "outputs": [{ "name": "", "type": "address[]" }],
        "payable": false,
        "stateMutability": "view", "type": "function"
    }, 
    {
        "constant": false,
        "inputs": [{ "name": "mininumContribution", "type": "uint256" }],
        "name": "createCampaign",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable", "type": "function"
    }
];

export const CAMPAING_ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "finalizeRequest",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "approvers",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getSummary",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "approvelsCount",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "manager",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "requests",
        "outputs": [
            {
                "name": "description",
                "type": "string"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "recipeint",
                "type": "address"
            },
            {
                "name": "complete",
                "type": "bool"
            },
            {
                "name": "approvalCount",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "description",
                "type": "string"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "recipeint",
                "type": "address"
            }
        ],
        "name": "createRequest",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "mininumContribution",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "contribute",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "approveRequest",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getTotalRequests",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "mininumValue",
                "type": "uint256"
            },
            {
                "name": "owner",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
];
