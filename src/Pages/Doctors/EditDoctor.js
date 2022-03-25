import {
    Stack,
    Input,
    Button,
    Container,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    FormControl,
    FormLabel,
    Heading,
    Spinner,
    Box,
    Image
} from "@chakra-ui/react";
import { useContext, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ArrowUpIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";

function EditDoctor() {
    const navigate = useNavigate();
    const diaCtx = useContext(AlertContext)
    const location = useLocation()
    const params= useParams();

    const [name, setName] = useState(location.state.name);
    const [field, setField] = useState(location.state.field);
    const [degree, setDegree] = useState(location.state.degree);
    const [contact_number, setContactNumber] = useState(location.state.contact_number);
    const [address, setAddress] = useState(location.state.address);
    const [email, setEmail] = useState(location.state.email);
    const [signature, setSignature] = useState(location.state.signature_file_path);
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
        setIsLoading(true);
        const saved = await window.api.updateDoctor({
            id: params.docID ,name, field, degree, contact_number, address, email,  signature_file_path: signature
        })
        setIsLoading(false)
        if (saved.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in creating Doctor. Please try again.`);
        } else {
            diaCtx.actions.showDialog("Done", `Successfully updated the information.`);
        }
    }
    return (
        <>
            <Container>
                <Heading>Edit Doctor.</Heading>
                <Stack spacing={3}>
                    <FormControl>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="field">Field</FormLabel>
                        <Input
                            placeholder='Field'
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="degree">Degree (Comma separated)</FormLabel>
                        <Input
                            placeholder='Ex- MBBS, MD etc'
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="contact_number">Contact Number</FormLabel>
                        <Input
                            placeholder='Contact Number'
                            value={contact_number}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
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
                        <Box boxSize='sm'>
                            <Image src={signature? signature: "None"} alt='Signature preview' />
                        </Box>
                    </FormControl>
                    <Button isLoading={isLoading} colorScheme='gray' onClick={() => submitHandler()}>Save</Button>
                </Stack>
            </Container>
        </>
    );
}

export default EditDoctor;