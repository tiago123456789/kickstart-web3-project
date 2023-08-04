import { GetServerSideProps } from "next";
import Layout from "../../../../components/Layout";
import { Button, Form } from "semantic-ui-react";
import useAlertMessage from "../../../../hooks/useAlertMessage";
import { useState } from "react";
import { 
    Request, SummaryCampaing, 
    createRequestInCampaing, getSummaryCampaign 
} from "../../../../services/campaing";
import Alert from "../../../../components/Alert";

function Requests(props) {
    const {
        errorMessage, successMessage,
        setErrorMessage, setSuccessMessage
    } = useAlertMessage();
    const [summary, _] = useState<SummaryCampaing>(props.summary)

    const [request, setRequest] = useState<{ [key: string]: any }>({
        description: "",
        value: "",
        recipeint: ""
    })

    const onChangeInputValue = (key: string, value: string) => {
        setRequest({
            ...request,
            [key]: value
        })
    }

    const submit = async () => {
        if (request.description.length === 0) {
            setErrorMessage("Description is required");
            return;
        }

        if (request.value.length === 0) {
            setErrorMessage("Value is required");
            return;
        } 
        
        if (parseFloat(request.value) > summary.balance) {
            setErrorMessage(`Value specified can\'t be more than ${summary.balance} wei.`);
            return;
        }

        if (request.recipeint.length == 0) {
            setErrorMessage("Recipeint is required");
            return;
        }

        const data: Request = (request as Request);
        try {
            setErrorMessage("")
            setSuccessMessage("Creating request...")
            await createRequestInCampaing(
                props.address,
                data
            )
            setSuccessMessage("Created request.")
            setRequest({
                description: "",
                value: "",
                recipeint: ""
            })
        } catch(error) {
            setErrorMessage("Oops! Occour one error and process no complete.")
        }
        
    }

    return (
        <Layout>
            <h1>Campaing: {props.address}</h1>
            <h2>New requests</h2>

            <Alert type="red" message={errorMessage} />
            <Alert type="blue" message={successMessage} />
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input
                        label='Description'
                        value={request.description}
                        onChange={(event) => onChangeInputValue("description", event.target.value)}
                    />

                    <Form.Input
                        label='Value to transfer(Wei)'
                        value={request.value}
                        onChange={(event) => onChangeInputValue("value", event.target.value)}
                    />

                    <Form.Input
                        label='Recipeint'
                        value={request.recipeint}
                        onChange={(event) => onChangeInputValue("recipeint", event.target.value)}
                    />

                </Form.Group>
                <Form.Group widths='equal'>
                    <Button onClick={() => submit()} color="blue" >
                        Create
                    </Button>
                </Form.Group>
            </Form>
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



export default Requests;