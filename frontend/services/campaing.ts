import { CAMPAING_ABI, CAMPAING_FACTORY_ABI } from "../contants/contract-abi";
import web3 from "./web3"

const ADDRESS = process.env.NEXT_PUBLIC_ADDRESS

// @ts-ignore
const instance = new web3.eth.Contract(CAMPAING_FACTORY_ABI, ADDRESS);

export interface Campaign {
    mininumContribution: number;
}

export interface SummaryCampaing {
    balance: number;
    mininumContribution: number;
    totalRequests: number;
    totalContributors: number;
    manager: string;
}

export interface Request {
    description: string,
    value: number,
    recipeint: string
    complete: boolean
    totalApprovals: number
    summaryApprovals: string
}

export interface CampaingsDeployed {
    address: string[];
}

export const getCampaigns = async (): Promise<CampaingsDeployed> => {
    const campaignsDeployed: string[] = await instance.methods.getDeployedCampaigns().call()
    return {
        address: campaignsDeployed
    }
}

export const addCampaign = async (data: Campaign): Promise<void> => {
    const accounts = await web3.eth.getAccounts();
    return instance.methods.createCampaign(data.mininumContribution).send({
       from: accounts[0]
    })
}

export const getSummaryCampaign = async (address: string): Promise<SummaryCampaing> => {
    const campaing = await new web3.eth.Contract(CAMPAING_ABI, address);
    const summary = await campaing.methods.getSummary().call();
    return {
        balance: web3.utils.toWei(summary[1], "wei"),
        mininumContribution: web3.utils.toWei(summary[0], "wei"),
        totalRequests: web3.utils.toNumber(summary[2]),
        totalContributors: web3.utils.toNumber(summary[3]),
        manager: summary[4]
    }
}

export const contributeInCampaing = async (address: string, value: number): Promise<void> => {
    const accounts = await web3.eth.getAccounts();
    const campaing = await new web3.eth.Contract(CAMPAING_ABI, address);
    await campaing.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "wei")
    })
}

export const createRequestInCampaing = async (address: string, request: Request): Promise<void> => {
    const accounts = await web3.eth.getAccounts();
    const campaing = await new web3.eth.Contract(CAMPAING_ABI, address);
    await campaing.methods.createRequest(
        request.description, 
        web3.utils.toWei(request.value, "wei"), 
        request.recipeint
    ).send({
        from: accounts[0],
    })
}

export const getRequestsInCampaing = async (address: string): Promise<Request[]> => {
    const campaing = await new web3.eth.Contract(CAMPAING_ABI, address);
    let totalRequests = await campaing.methods.getTotalRequests().call();
    let totalContributers = await campaing.methods.approvelsCount().call();
    totalContributers = web3.utils.toNumber(totalContributers)
    totalRequests = web3.utils.toNumber(totalRequests)

    const getRequestsPromises = [];
    for (let index = 0; index < totalRequests; index++) {
        getRequestsPromises.push(
            campaing.methods.requests(index).call()
        )
    }

    const requests = await Promise.all(getRequestsPromises)

    return requests.map(item => {
        const totalApprovals = item.totalApprovals || 0
        
        return {
            description: item.description,
            value: web3.utils.toWei(item.value, 'wei'),
            recipeint: item.recipeint,
            complete: item.complete,
            totalApprovals: totalApprovals,
            summaryApprovals: `${totalApprovals}/${totalContributers}`
        }
    })
}


export const approveInCampaing = async (
    address: string, requestIndex: number
): Promise<void> => {
    const accounts = await web3.eth.getAccounts();
    const campaing = await new web3.eth.Contract(CAMPAING_ABI, address);
    await campaing.methods.approveRequest(requestIndex).send({
        from: accounts[0]
    });
}


export const finalizeInCampaing = async (
    address: string, requestIndex: number
): Promise<void> => {
    const accounts = await web3.eth.getAccounts();
    const campaing = await new web3.eth.Contract(CAMPAING_ABI, address);
    await campaing.methods.finalizeRequest(requestIndex).send({
        from: accounts[0]
    });
}



