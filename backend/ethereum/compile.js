const path = require("path")
const fs = require("fs-extra")
const solc = require("solc")

const campaingPath = path.resolve(__dirname, 'contracts', "Campaign.sol")
const buildDirectory = path.resolve(__dirname, "build")
const campaingSource = fs.readFileSync(campaingPath, 'utf-8')

fs.ensureDirSync(buildDirectory);

const contractsCompiled = solc.compile(campaingSource, 1).contracts

for (let contract in contractsCompiled) {
    fs.outputJsonSync(
        path.resolve(buildDirectory, `${contract.replace(":", "")}.json`),
        contractsCompiled[contract]
    )
}

console.log(`Finished to process compile contract.`)


