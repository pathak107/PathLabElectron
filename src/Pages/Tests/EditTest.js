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
    Text

} from "@chakra-ui/react";
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddTestParameterModal from "../../Components/PopOvers/AddTestParameter";
import { TestParaContext } from "../../Context/TestParaContext";

function EditTest() {
    const ctx = useContext(TestParaContext);
    const params = useParams();
    const location = useLocation()
    const [testData, setTestData] = useState(location.state);
    const [TestParameters, setTestParameters] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        window.api.getTestParameters(params.testID)
        window.api.response((tp) => setTestParameters(tp))
        setIsLoading(false)
    }, [params.testID])

    const submitHandler=()=>{

    }
    const addTestParaHandler = () => {
        ctx.actions.setTestID(testData.id)
        ctx.actions.setIsOpen(true);
    }
    return (
        <>
            <Container maxW='container.lg'>
                <AddTestParameterModal/>
                <Heading>Edit {testData.name}</Heading>
                <Stack spacing={3}>
                    <FormControl>
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
                    </FormControl>

                    <FormControl>
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
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea placeholder='Description' value={testData.description}
                            onChange={(e) => {
                                const newTestData = { ...testData }
                                newTestData.description = e.target.value
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
                                        return <Tr>
                                            <Td>{testPara.name}</Td>
                                            <Td>{testPara.unit}</Td>
                                            <Td>{testPara.range}</Td>
                                            <Td>{testPara.description}</Td>
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