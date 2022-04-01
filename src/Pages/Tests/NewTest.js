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
    Text,
    Table,
    Thead,
    Td,
    Tbody,
    TableCaption,
    Th,
    Tr,
    Spinner,
    FormErrorMessage,
} from "@chakra-ui/react";
import { useContext, useState } from 'react'
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";
import { isRequired, Validation, Validate, isArrNotEmpty } from "../../helpers/validation";
import { TestParaContext } from "../../Context/TestParaContext";
import AddTestParameterModal from "../../Components/PopOvers/AddTestParameter";

function NewTest() {
    const ctx = useContext(TestParaContext);
    const navigate = useNavigate();
    const diaCtx = useContext(AlertContext)
    const [name, setName] = useState('');
    const [cost, setCost] = useState(0);
    const [desc, setDesc] = useState('');
    const [TestParameters, setTestParameters] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const [valid, setValid] = useState(Validation([
        {
            field: "name",
            validations: [isRequired]
        },
        {
            field: "cost",
            validations: [isRequired]
        },
        {
            field: "TestParameters",
            validations: [isArrNotEmpty]
        },
    ]))

    const submitHandler = async () => {
        const isValid = Validate(valid, { name, desc, cost, TestParameters })
        if (!isValid.valid) {
            setValid(isValid.validation)
            return
        }
        setIsLoading(true);
        console.log(TestParameters)
        const created = await window.api.addTest({
            name: name,
            cost: cost,
            description: desc,
            TestParameters
        })
        setIsLoading(false)
        if (created.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in creating test. Please try again.`);
        } else {
            navigate(-1);
        }
    }

    const addTestParaHandler = () => {
        ctx.actions.setIsForNewTest(true)
        ctx.actions.setIsOpen(true);
        ctx.actions.setIsOpen(true);
    }

    return (
        <>
            <Container>
                <AddTestParameterModal callback={
                    (paraData) => {
                        const newParas = [...TestParameters]
                        newParas.push(paraData)
                        setTestParameters(newParas)
                        console.log(TestParameters)
                    }
                } />
                <Heading>Create new Test.</Heading>
                <Stack spacing={3}>
                    <FormControl isRequired isInvalid={valid.name.isInvalid}>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                            placeholder='Name'
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                        <FormErrorMessage>{valid.name.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={valid.cost.isInvalid}>
                        <FormLabel htmlFor='cost'>Cost</FormLabel>
                        <NumberInput defaultValue={cost} min={0} value={cost}
                            onChange={(cost) => {
                                setCost(cost);
                            }}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>{valid.cost.errorMsg}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <ReactQuill
                            value={desc}
                            placeholde="Description"
                            onChange={(value) => {
                                setDesc(value);
                            }}
                        />
                    </FormControl>

                    <Button colorScheme='gray' onClick={() => addTestParaHandler()}>Add Parameter</Button>
                    <Button colorScheme='gray' onClick={() => submitHandler()}>Save</Button>
                    <Table variant='simple'>
                        {valid.TestParameters.isInvalid ? <Text color='red'>Error: {valid.TestParameters.errorMsg}</Text> : null}
                        <TableCaption>List of all the Test Parameters</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Unit</Th>
                                <Th>Range</Th>
                                <Th>Description</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {TestParameters.map((testPara, index) => {
                                return <Tr key={index}>
                                    <Td >{testPara.name}</Td>
                                    <Td >{testPara.unit}</Td>
                                    <Td >{testPara.range}</Td>
                                    <Td >{testPara.description}</Td>
                                </Tr>
                            })}

                        </Tbody>
                    </Table>
                </Stack>
            </Container>
        </>
    );
}

export default NewTest;