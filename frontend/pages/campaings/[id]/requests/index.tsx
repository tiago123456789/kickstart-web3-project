import { Button, Grid, Icon, Table } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { Request, approveInCampaing, finalizeInCampaing, getRequestsInCampaing } from "../../../../services/campaing";
import { useState } from "react";
import useAlertMessage from "../../../../hooks/useAlertMessage";
import Alert from "../../../../components/Alert";

function Requests(props) {
    const {
        errorMessage, setErrorMessage,
        successMessage, setSuccessMessage
    } = useAlertMessage()
    const [requests, _] = useState<Request[]>(props.requests)
    const campaingAddress = props.address

    const approve = async (index: number) => {
        try {
            setSuccessMessage("Waiting process to approve complete...")
            await approveInCampaing(props.address, index)
            setSuccessMessage("Process to approve completed")
            getRequestsInCampaing(props.address)
        } catch (error) {
            setErrorMessage("Oops! Occour error, so the process no complete")
        }
    }

    const finalize = async (index: number) => {
        try {
            setSuccessMessage("Waiting process to approve complete...")
            await finalizeInCampaing(props.address, index)
            setSuccessMessage("Process to approve completed")
            getRequestsInCampaing(props.address)
        } catch (error) {
            setErrorMessage("Oops! Occour error, so the process no complete")
        }
    }

    return (
        <Layout>
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column>
                        <Link href={`/campaings/${campaingAddress}/requests/new`}>
                            <Button color="blue">
                                <Icon name="plus" /> New request
                            </Button>
                        </Link>
                        <h1>Campaing: {campaingAddress}</h1>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <h2>Requests</h2>
                        <Alert type="red" message={errorMessage} />
                        <Alert type="green" message={successMessage} />
                        <Table celled className="center aligned">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Description</Table.HeaderCell>
                                    <Table.HeaderCell>Value(Wei)</Table.HeaderCell>
                                    <Table.HeaderCell>Recipeint</Table.HeaderCell>
                                    <Table.HeaderCell>Complete</Table.HeaderCell>
                                    <Table.HeaderCell>Summary approvations</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    requests.map((item, index) => {
                                        return (
                                            <Table.Row disabled={item.complete} key={index}>
                                                <Table.Cell>
                                                    {item.description}
                                                </Table.Cell>
                                                <Table.Cell>{item.value}</Table.Cell>
                                                <Table.Cell>{item.recipeint}</Table.Cell>
                                                <Table.Cell>{(item.complete ? "Yes" : "No")}</Table.Cell>
                                                <Table.Cell>{item.summaryApprovals}</Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        !item.complete &&
                                                        <>
                                                            <Button onClick={() => approve(index)} color="blue">
                                                                Approve
                                                            </Button>
                                                            <Button onClick={() => finalize(index)} color="red">
                                                                Finalize
                                                            </Button>
                                                        </>
                                                    }

                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const address = context.query.id as string;
    const requests = await getRequestsInCampaing(address)
    return {
        props: {
            address,
            requests
        }
    }
}

export default Requests;