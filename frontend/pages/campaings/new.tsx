import { Button, Card, Form } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { useState } from "react";
import Alert from "../../components/Alert";
import {  addCampaign } from "../../services/campaing"
import useAlertMessage from "../../hooks/useAlertMessage";

function New() {
    const [mininumContribution, setMininumContribution] = useState<string>("100");
    const { 
        errorMessage, setErrorMessage,
        successMessage, setSuccessMessage
    } = useAlertMessage()
    
    const submit = async () => {
        if (mininumContribution.length === 0 ||  parseFloat(mininumContribution) <= 0) {
            setErrorMessage("Mininum contribution value needs more than 0. For example: 100")
            return;
        }

        try {setErrorMessage(null)
            setSuccessMessage("Waiting campaign creation process finish...")
            await addCampaign({ mininumContribution:  parseFloat(mininumContribution) })
            setSuccessMessage("Campaign created success.")
        } catch(error) {
            setSuccessMessage(null)
            setErrorMessage("Oops! Occour error and can't complete operation.")
        }
    }

    return (
        <Layout>
            <h2>New campaing</h2>
            <Alert type="red" message={errorMessage} />
            <Alert type="blue" message={successMessage} />
            <Card fluid>
                <Card.Content>
                    <Form>
                        <Form.Field>
                            <label>Mininum contribution(Wei):</label>
                            <input 
                            type="number"
                            value={mininumContribution}
                            onChange={event => setMininumContribution(event.target.value)}
                            placeholder='100' />
                        </Form.Field>
                        <Button primary onClick={() => submit()}>create</Button>
                    </Form>
                </Card.Content>
            </Card>
        </Layout>
    )
}

export default New;