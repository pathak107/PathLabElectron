import {
    Stack,
    Input,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Image,
    Box,
    FormErrorMessage
} from "@chakra-ui/react";
import { useContext, useState } from 'react'
import { ArrowUpIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";
import { isEmail, isPhoneNumber, isRequired, Validate, Validation } from "../../helpers/validation";

function NewDoctor() {
    const navigate = useNavigate();
    const diaCtx = useContext(AlertContext)
    const [name, setName] = useState(null);
    const [field, setField] = useState(null);
    const [degree, setDegree] = useState(null);
    const [contact_number, setContactNumber] = useState(null);
    const [address, setAddress] = useState(null);
    const [email, setEmail] = useState(null);
    const [signature, setSignature] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const uploadSignature = async () => {
        const signature_file_path = await window.api.uploadFile({
            type: 'image'
        })
        if (signature_file_path.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in selecting the signature. Please try again.`);
        }
        setSignature(signature_file_path.data);
    }

    const submitHandler = async () => {
        const isValid= Validate(valid, {name, field, degree, contact_number, email})
        if(!isValid.valid){
            setValid(isValid.validation)
            return
        }
        setIsLoading(true);
        const created = await window.api.createDoctor({
            name, field, degree, contact_number, address, email, signature_file_path: signature
        })
        setIsLoading(false)
        if (created.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in creating Doctor. Please try again.`);
        } else {
            navigate(-1);
        }
    }

    const [valid, setValid]=useState(Validation([
        {
            field:"name",
            validations:[isRequired]
        },
        {
            field:"field",
            validations:[isRequired]
        },
        {
            field:"degree",
            validations:[isRequired]
        },
        {
            field:"email",
            validations:[isEmail]
        },
        {
            field:"contact_number",
            validations:[isPhoneNumber]
        },
    ]))
    return (
        <>
            <Container>
                <Heading>Create new Doctor.</Heading>
                <Stack spacing={3}>
                    <FormControl isRequired isInvalid={valid.name.isInvalid}>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <FormErrorMessage>{valid.name.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={valid.field.isInvalid}>
                        <FormLabel htmlFor="field">Field</FormLabel>
                        <Input
                            placeholder='Field'
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                        />
                        <FormErrorMessage>{valid.field.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={valid.degree.isInvalid}>
                        <FormLabel htmlFor="degree">Degree (Comma separated)</FormLabel>
                        <Input
                            placeholder='Ex- MBBS, MD etc'
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                        />
                        <FormErrorMessage>{valid.degree.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={valid.email.isInvalid}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormErrorMessage>{valid.email.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={valid.contact_number.isInvalid}>
                        <FormLabel htmlFor="contact_number">Contact Number</FormLabel>
                        <Input
                            placeholder='Contact Number'
                            value={contact_number}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
                        <FormErrorMessage>{valid.contact_number.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <Input
                            placeholder='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <Button leftIcon={<ArrowUpIcon />} onClick={uploadSignature} colorScheme='gray'>Upload Signature</Button>
                        <Box boxSize='xs'>
                            <Image src={signature? `media://${signature}`: "None"} alt='Signature preview' />
                        </Box>
                    </FormControl>
                    <Button isLoading={isLoading} colorScheme='gray' onClick={() => submitHandler()}>Submit</Button>
                </Stack>
            </Container>
        </>
    );
}

export default NewDoctor;