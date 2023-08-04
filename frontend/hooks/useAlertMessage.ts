import { useState } from "react";

export default function useAlertMessage() {
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null);

    return {
        errorMessage, 
        successMessage,
        setErrorMessage,
        setSuccessMessage
    }
}