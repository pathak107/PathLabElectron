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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Progress,
    Text,
    FormErrorMessage

} from "@chakra-ui/react";
import { useContext, useEffect, useState } from 'react'
import ReactQuill from "react-quill";
import { useLocation, useParams } from "react-router-dom";
import AddTestParameterModal from "../../Components/PopOvers/AddTestParameter";
import { AlertContext } from "../../Context/AlertContext";
import { TestParaContext } from "../../Context/TestParaContext";
import {isNumber, isRequired,Validate, Validation} from "../../helpers/validation"

function EditTest() {
    const ctx = useContext(TestParaContext);
    const diaCtx = useContext(AlertContext)
    const params = useParams();
    const location = useLocation()
    const [testData, setTestData] = useState(location.state);
    const [TestParameters, setTestParameters] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const getTestParameters = async () => {
        setIsLoading(true);
        const tp = await window.api.getTestParameters(params.testID)
        if (tp.error) {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${tp.error}`);
        }
        setTestParameters(tp.data)
        setIsLoading(false)
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getTestParameters()
        }
        return () => {
            isApiSubscribed = false
        }
    },
        [ctx.state.isLoading])

    const submitHandler = async () => {
        const isValid=Validate(valid,{
            name:testData.name,
            cost:testData.cost,
        })
        setValid(isValid.validation)
        if(!isValid.valid){
            return
        }
        
        setIsLoading(true);
        const updated= await window.api.updateTest({name:testData.name, cost: testData.cost, desc: testData.description, testID: params.testID})
        setIsLoading(false)
        if (updated.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in updating test. Please try again.`);
        } else {
            diaCtx.actions.showDialog("Done", `Successfully updated the data.`);
        }

    }
    const addTestParaHandler = () => {
        ctx.actions.setIsForNewTest(false)
        ctx.actions.setTestID(testData.id)
        ctx.actions.setIsOpen(true);
    }

    const [valid, setValid] = useState(Validation([
        {
            field: "name",
            validations: [isRequired]
        },
        {
            field: "cost",
            validations: [isRequired, isNumber]
        },
    ]))

    return (
        <>
            <Container maxW='container.lg'>
                <AddTestParameterModal />
                <Heading>Edit {testData.name}</Heading>
                <Stack spacing={3}>
                    <FormControl isRequired isInvalid={valid.name.isInvalid}>
                        <FormLabel htmlFor="name">Edit Test</FormLabel>
                        <Input
                            placeholder='Name'
                            value={testData.name}
                            onChange={(e) => {
                                const newTestData = { ...testData }
                                newTestData.name = e.target.value
                                setTestData(newTestData);
                            }}
                        />
                        <FormErrorMessage>{valid.name.errorMsg}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={valid.cost.isInvalid}>
                        <FormLabel htmlFor='cost'>Cost</FormLabel>
                        <NumberInput defaultValue={testData.cost} min={0} value={testData.cost}
                            onChange={(cost) => {
                                const newTestData = { ...testData }
                                newTestData.cost = cost
                                setTestData(newTestData);
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
                            value={testData.description}
                            placeholde="Description"
                            onChange={(value) => {
                                const newTestData = { ...testData }
                                newTestData.description = value
                                setTestData(newTestData);
                            }}
                        />
                    </FormControl>

                    <Button colorScheme='gray' onClick={() => addTestParaHandler()}>Add Parameter</Button>
                    <Button colorScheme='gray' onClick={() => submitHandler()}>Save</Button>
                    {isLoading ? <Progress isIndeterminate size='xs' /> :
                        TestParameters.length === 0 ? <Text>Sorry this test has no Parameters</Text> :
                            <Table variant='simple'>
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
                                    {TestParameters.map((testPara) => {
                                        return <Tr key={testPara.id}>
                                            <Td >{testPara.name}</Td>
                                            <Td >{testPara.unit}</Td>
                                            <Td >{testPara.range}</Td>
                                            <Td >{testPara.description}</Td>
                                        </Tr>
                                    })}

                                </Tbody>
                            </Table>
                    }
                </Stack>
            </Container>
        </>
    );
}

export default EditTest;