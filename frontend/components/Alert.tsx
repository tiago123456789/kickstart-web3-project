import { Icon, Message } from "semantic-ui-react";

function Alert({ message, type }) {
    if (!message) {
        return false;
    }

    return (
        <Message color={type}>
            <p><Icon name="warning circle"/>{message}</p>
        </Message>
    )
}

export default Alert;