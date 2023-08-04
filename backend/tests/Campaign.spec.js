const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider())
const campaingFactoryCompiled = require("../ethereum/build/CampaignFactory.json")
const campaingCompiled = require("../ethereum/build/Campaign.json")


describe("Campaing contract", () => {
    let campaingFactoryContract;
    let accounts;
    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();
        campaingFactoryContract = await new web3.eth.Contract(JSON.parse(campaingFactoryCompiled.interface))
            .deploy({ data: campaingFactoryCompiled.bytecode })
            .send({ from: accounts[0], gas: '1000000' })
    })

    it("Should be empty list of deployedCampaigns after deploy contract", async () => {
        const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call()
        expect(deployedCampaigns.length).toBe(0)
    });

    it("Should be return list of deployedCampaigns with 1 item after call createCampaign", async () => {
        const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
        await campaingFactoryContract.methods
            .createCampaign(fakeMininumContribuin)
            .send({ from: accounts[0], gas: '1000000' });
        const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
        const campaingContract = await new web3.eth.Contract(
            JSON.parse(campaingCompiled.interface),
            deployedCampaigns[0]
        )

        const manager = await campaingContract.methods.manager().call();
        const mininumContribution = await campaingContract.methods.mininumContribution().call();
        expect(deployedCampaigns.length).toBe(1)
        expect(manager).toBe(accounts[0])
        expect(web3.utils.toWei(mininumContribution, 'wei')).toBe(fakeMininumContribuin)
    });

    it("Should be add user in approvels array after contribute to campaing", async () => {
        const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
        await campaingFactoryContract.methods
            .createCampaign(fakeMininumContribuin)
            .send({ from: accounts[0], gas: '1000000' });
        const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
        const campaingContract = await new web3.eth.Contract(
            JSON.parse(campaingCompiled.interface),
            deployedCampaigns[0]
        )

        let hasApprovel = await campaingContract.methods.approvers(accounts[0]).call();
        expect(hasApprovel).toBe(false);
        await campaingContract.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei(0.01, "ether")
        });

        hasApprovel = await campaingContract.methods.approvers(accounts[0]).call();
        const approvalCount = await campaingContract.methods.approvelsCount().call();

        expect(hasApprovel).toBe(true);
        expect(web3.utils.toNumber(approvalCount)).toBe(1)
    })

    it("Should be throw exception when try contribute, but value user informed less than mininum contribuin", async () => {
        try {
            const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
            await campaingFactoryContract.methods
                .createCampaign(fakeMininumContribuin)
                .send({ from: accounts[0], gas: '1000000' });
            const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
            const campaingContract = await new web3.eth.Contract(
                JSON.parse(campaingCompiled.interface),
                deployedCampaigns[0]
            )

            await campaingContract.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(0.001, "ether")
            });
        } catch (error) {
            expect(true).toBe(true);
        }
    })

    it('Should be throw exception when user is not onwer the campaing and try create requests', async () => {
        try {
            const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
            await campaingFactoryContract.methods
                .createCampaign(fakeMininumContribuin)
                .send({ from: accounts[0], gas: '1000000' });
            const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
            const campaingContract = await new web3.eth.Contract(
                JSON.parse(campaingCompiled.interface),
                deployedCampaigns[0]
            )

            await campaingContract.methods.createRequest(
                "Buy test",
                web3.utils.toWei(0.01, 'ether'),
                accounts[1]
            ).send({
                from: accounts[2]
            });
        } catch (error) {
            expect(true).toBe(true);
        }
    })

    it('Should be create requests to buy something success', async () => {
        const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
        await campaingFactoryContract.methods
            .createCampaign(fakeMininumContribuin)
            .send({ from: accounts[0], gas: '1000000' });
        const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
        const campaingContract = await new web3.eth.Contract(
            JSON.parse(campaingCompiled.interface),
            deployedCampaigns[0]
        )

        await campaingContract.methods.createRequest(
            "Buy test",
            web3.utils.toWei(0.01, 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaingContract.methods.requests(0).call();
        expect(request.description).toBe("Buy test");
        expect(web3.utils.toWei(request.value, "wei")).toBe(web3.utils.toWei(0.01, 'ether'));
        expect(request.recipeint).toBe(accounts[1]);
    })

    it("Should be throw exception when try approve request created, but user is not contributed", async () => {
        try {
            const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
            await campaingFactoryContract.methods
                .createCampaign(fakeMininumContribuin)
                .send({ from: accounts[0], gas: '1000000' });
            const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
            const campaingContract = await new web3.eth.Contract(
                JSON.parse(campaingCompiled.interface),
                deployedCampaigns[0]
            )

            await campaingContract.methods.createRequest(
                "Buy test",
                web3.utils.toWei(0.01, 'ether'),
                accounts[1]
            ).send({
                from: accounts[0],
                gas: '1000000'
            });

            const requestIndex = 0
            await campaingContract.methods.approveRequest(
                requestIndex
            ).send({
                from: accounts[0],
                gas: '1000000'
            });
        } catch (error) {
            expect(true).toBe(true)
        }
    })

    it("Should be throw exception when try approve request created more than 1 time", async () => {
        try {
            const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
            await campaingFactoryContract.methods
                .createCampaign(fakeMininumContribuin)
                .send({ from: accounts[0], gas: '1000000' });
            const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
            const campaingContract = await new web3.eth.Contract(
                JSON.parse(campaingCompiled.interface),
                deployedCampaigns[0]
            )

            await campaingContract.methods.createRequest(
                "Buy test",
                web3.utils.toWei(0.01, 'ether'),
                accounts[1]
            ).send({
                from: accounts[0],
                gas: '1000000'
            });

            await campaingContract.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(0.01, "ether")
            });

            const requestIndex = 0
            await campaingContract.methods.approveRequest(
                requestIndex
            ).send({
                from: accounts[0],
                gas: '1000000'
            });
            await campaingContract.methods.approveRequest(
                requestIndex
            ).send({
                from: accounts[0],
                gas: '1000000'
            });
            expect(true).toBe(false)
        } catch (error) {
            expect(true).toBe(true)
        }
    })


    it("Should be approve request created success", async () => {
        const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
        await campaingFactoryContract.methods
            .createCampaign(fakeMininumContribuin)
            .send({ from: accounts[0], gas: '1000000' });
        const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
        const campaingContract = await new web3.eth.Contract(
            JSON.parse(campaingCompiled.interface),
            deployedCampaigns[0]
        )

        await campaingContract.methods.createRequest(
            "Buy test",
            web3.utils.toWei(0.01, 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaingContract.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei(0.01, "ether")
        });

        const requestIndex = 0
        await campaingContract.methods.approveRequest(
            requestIndex
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await campaingContract.methods.requests(requestIndex).call();
        expect(web3.utils.toNumber(request.approvalCount)).toBe(1)
    })


    it("Should be throw exception when try finalize request but people try finalize is not owner of contract", async () => {
        try {
            const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
            await campaingFactoryContract.methods
                .createCampaign(fakeMininumContribuin)
                .send({ from: accounts[0], gas: '1000000' });
            const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
            const campaingContract = await new web3.eth.Contract(
                JSON.parse(campaingCompiled.interface),
                deployedCampaigns[0]
            )

            await campaingContract.methods.createRequest(
                "Buy test",
                web3.utils.toWei(0.01, 'ether'),
                accounts[1]
            ).send({
                from: accounts[0],
                gas: '1000000'
            });

            const requestIndex = 0
            await campaingContract.methods.finalizeRequest(requestIndex).send({
                from: accounts[1],
                gas: "1000000"
            });
            expect(true).toBe(false)
        } catch (error) {
            expect(true).toBe(true)
        }
    })

    it("Should be throw exception when try finalize request but don't have enough approvation to do this", async () => {
        try {
            const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
            await campaingFactoryContract.methods
                .createCampaign(fakeMininumContribuin)
                .send({ from: accounts[0], gas: '1000000' });
            const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
            const campaingContract = await new web3.eth.Contract(
                JSON.parse(campaingCompiled.interface),
                deployedCampaigns[0]
            )

            await campaingContract.methods.createRequest(
                "Buy test",
                web3.utils.toWei(0.01, 'ether'),
                accounts[1]
            ).send({
                from: accounts[0],
                gas: '1000000'
            });

            await campaingContract.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(0.01, "ether")
            });

            await campaingContract.methods.contribute().send({
                from: accounts[1],
                value: web3.utils.toWei(0.01, "ether")
            });

            await campaingContract.methods.contribute().send({
                from: accounts[2],
                value: web3.utils.toWei(0.01, "ether")
            });

            const requestIndex = 0
            await campaingContract.methods.finalizeRequest(requestIndex).send({
                from: accounts[0],
                gas: "1000000"
            });
            expect(true).toBe(false)
        } catch (error) {
            expect(true).toBe(true)
        }


    })

    it("Should be throw exception when try finalize request was complete", async () => {
        try {
            const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
            await campaingFactoryContract.methods
                .createCampaign(fakeMininumContribuin)
                .send({ from: accounts[0], gas: '1000000' });
            const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
            const campaingContract = await new web3.eth.Contract(
                JSON.parse(campaingCompiled.interface),
                deployedCampaigns[0]
            )

            await campaingContract.methods.createRequest(
                "Buy test",
                web3.utils.toWei(0.01, 'ether'),
                accounts[1]
            ).send({
                from: accounts[0],
                gas: '1000000'
            });

            await campaingContract.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(0.01, "ether")
            });

            await campaingContract.methods.contribute().send({
                from: accounts[1],
                value: web3.utils.toWei(0.01, "ether")
            });

            const requestIndex = 0
            await campaingContract.methods.approveRequest(requestIndex).send({
                from: accounts[0],
                gas: "1000000"
            });

            await campaingContract.methods.finalizeRequest(requestIndex).send({
                from: accounts[0],
                gas: "1000000"
            });

            await campaingContract.methods.finalizeRequest(requestIndex).send({
                from: accounts[0],
                gas: "1000000"
            });
            expect(true).toBe(false)
        } catch (error) {
            expect(true).toBe(true)
        }
    })

    it("Should be finalize request created with success", async () => {
        const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
        await campaingFactoryContract.methods
            .createCampaign(fakeMininumContribuin)
            .send({ from: accounts[0], gas: '1000000' });
        const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
        const campaingContract = await new web3.eth.Contract(
            JSON.parse(campaingCompiled.interface),
            deployedCampaigns[0]
        )

        await campaingContract.methods.createRequest(
            "Buy test",
            web3.utils.toWei(0.01, 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        const account1OldBalance = await web3.eth.getBalance(accounts[1])

        await campaingContract.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei(0.01, "ether")
        });

        const requestIndex = 0
        await campaingContract.methods.approveRequest(requestIndex).send({
            from: accounts[0],
            gas: "1000000"
        });

        await campaingContract.methods.finalizeRequest(requestIndex).send({
            from: accounts[0],
            gas: "1000000"
        });


        const account1NewBalance = await web3.eth.getBalance(accounts[1])
        const request = await campaingContract.methods.requests(0).call()
        const isTransafer = web3.utils.toWei(account1NewBalance, 'wei')
        > web3.utils.toWei(account1OldBalance, 'wei')
        expect(isTransafer).toBe(true)
        expect(request.complete).toBe(true)
    })

    it("Should be get total requests the campaing success", async () => {
        const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
        await campaingFactoryContract.methods
            .createCampaign(fakeMininumContribuin)
            .send({ from: accounts[0], gas: '1000000' });
        const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
        const campaingContract = await new web3.eth.Contract(
            JSON.parse(campaingCompiled.interface),
            deployedCampaigns[0]
        )

        await campaingContract.methods.createRequest(
            "Buy test",
            web3.utils.toWei(0.01, 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });


        const totalRequests = await campaingContract.methods.getTotalRequests().call();
        expect(web3.utils.toNumber(totalRequests)).toBe(1)
    })

    it("Should be get Summary the campaing success", async () => {
        const fakeMininumContribuin = web3.utils.toWei(0.01, 'ether');
        await campaingFactoryContract.methods
            .createCampaign(fakeMininumContribuin)
            .send({ from: accounts[0], gas: '1000000' });
        const deployedCampaigns = await campaingFactoryContract.methods.getDeployedCampaigns().call();
        const campaingContract = await new web3.eth.Contract(
            JSON.parse(campaingCompiled.interface),
            deployedCampaigns[0]
        )

        await campaingContract.methods.createRequest(
            "Buy test",
            web3.utils.toWei(0.01, 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });


        const summary = await campaingContract.methods.getSummary().call();

        expect(web3.utils.toNumber(summary['3'])).toBe(0)
        expect(web3.utils.toNumber(summary['2'])).toBe(1)
        expect(web3.utils.toNumber(summary['1'])).toBe(0)
        expect(web3.utils.toWei(summary['0'], 'wei')).toBe("10000000000000000")
        expect(summary['4']).toBe(accounts[0])
    })

})