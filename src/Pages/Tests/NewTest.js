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
} from "@chakra-ui/react";
import { useContext, useState } from 'react'
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";

function NewTest() {
    const navigate = useNavigate();
    const diaCtx = useContext(AlertContext)
    const [name, setName] = useState('');
    const [cost, setCost] = useState(0);
    const [desc, setDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async () => {
        setIsLoading(true);
        const created = await window.api.addTest({
            name: name,
            cost: cost,
            description: desc
        })
        setIsLoading(false)
        if (created.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in creating test. Please try again.`);
        } else {
            navigate(-1);
        }
    }
    return (
        <>
            <Container>
                <Heading>Create new Test.</Heading>
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
                        <FormLabel htmlFor='cost'>Cost</FormLabel>
                        <NumberInput defaultValue={cost} min={0} value={cost} onChange={(cost) => setCost(cost)}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <ReactQuill
                            value={desc}
                            placeholde="Description"
                            onChange={(value) => setDesc(value)}
                        />
                    </FormControl>
                    <Button isLoading={isLoading} colorScheme='gray' onClick={() => submitHandler()}>Submit</Button>
                </Stack>
            </Container>
        </>
    );
}

export default NewTest;