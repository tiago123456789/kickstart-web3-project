import Web3 from "web3";

let web3;

// @ts-ignore
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // @ts-ignore
    window.ethereum.request({ method: "eth_requestAccounts" });
    // @ts-ignore
    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        process.env.INFURE_URL
    );
    web3 = new Web3(provider);
}

export default web3;