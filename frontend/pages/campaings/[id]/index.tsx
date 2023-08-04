
import Layout from '../../../components/Layout'
import { Button, Card, Form, Grid } from 'semantic-ui-react'
import { SummaryCampaing, contributeInCampaing, getSummaryCampaign } from '../../../services/campaing'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import Alert from '../../../components/Alert'
import Link from 'next/link'
import useAlertMessage from '../../../hooks/useAlertMessage'

function Detail(props) {
    const address: string = props.address;
    const [summary, setSummaryCampaing] = useState<SummaryCampaing>(props.summary)
    const [contribution, setContribution] = useState<string>("")
    const { 
        errorMessage, setErrorMessage,
        successMessage, setSuccessMessage
    } = useAlertMessage()

    const submit = async () => {
        const hasMininumContribution = parseFloat(contribution) >= summary.mininumContribution;
        if (!contribution || !hasMininumContribution) {
            setErrorMessage(`The mininum contribution is ${summary.mininumContribution} wei`)
            return;
        }

        try {
            setErrorMessage("")
            setSuccessMessage("Waiting contribution process complete...")
            await contributeInCampaing(address, parseFloat(contribution)
            )
            setSuccessMessage("Contribution process completed.")
            const summary = await getSummaryCampaign(address)
            setSummaryCampaing(summary)
        } catch (error) {
            setErrorMessage("Oops! Occour error and operation no complete")
        }

    }

    return (
        <Layout>
            <h2>Campaing address: {address}</h2>

            <Grid columns={3}>
                <Grid.Column>
                    <Card.Group>
                        <Card>
                            <Card.Content>
                                <Card.Header>Campaing Balance</Card.Header>
                                <Card.Meta>{summary.balance} wei</Card.Meta>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Card.Header>Requests</Card.Header>
                                <Card.Meta>{summary.totalRequests}</Card.Meta>
                            </Card.Content>
                        </Card>
                        <Link href={`/campaings/${address}/requests`}>
                            <Button color='blue'>
                                View requests
                            </Button>
                        </Link>

                    </Card.Group>
                </Grid.Column>
                <Grid.Column>
                    <Card.Group>
                        <Card>
                            <Card.Content>
                                <Card.Header>Mininum contribution</Card.Header>
                                <Card.Meta>{summary.mininumContribution} wei</Card.Meta>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Card.Header>Contributors</Card.Header>
                                <Card.Meta>{summary.totalContributors}</Card.Meta>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Grid.Column>
                <Grid.Column>
                    <Alert type="red" message={errorMessage} />
                    <Alert type="green" message={successMessage} />
                    <Form>
                        <Form.Field>
                            <label>Contribute to this campaing(wei):</label>
                            <input
                                onChange={(event) => setContribution(event.target.value)}
                                value={contribution}
                                placeholder='100' type='number' />
                        </Form.Field>
                        <Button onClick={() => submit()} color="blue" type='submit'>Contribute</Button>
                    </Form>
                </Grid.Column>
            </Grid>

        </Layout>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const address = context.query.id as string;
    let summary: SummaryCampaing = await getSummaryCampaign(address);
    return {
        props: {
            address,
            summary
        }
    }
}


export default Detail;

