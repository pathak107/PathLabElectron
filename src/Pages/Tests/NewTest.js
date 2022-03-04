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
} from "@chakra-ui/react";
import {useState} from 'react'
import { useNavigate } from "react-router-dom";

function NewTest() {
    const navigate=useNavigate();
    const [name, setName]=useState('');
    const [cost, setCost]=useState(0);
    const [desc, setDesc]=useState('');

    const submitHandler=()=>{
        window.api.addTest({
            name:name,
            cost:cost,
            description:desc
        })
        navigate(-1);
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
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </FormControl>
                    
                    <FormControl>
                        <FormLabel htmlFor='cost'>Cost</FormLabel>
                        <NumberInput defaultValue={cost} min={0} value={cost} onChange={(cost)=>setCost(cost)}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea placeholder='Description' value={desc} onChange={(e)=>setDesc(e.target.value)} />
                    </FormControl>
                    <Button colorScheme='gray' onClick={()=>submitHandler()}>Submit</Button>
                </Stack>
            </Container>
        </>
    );
}

export default NewTest;