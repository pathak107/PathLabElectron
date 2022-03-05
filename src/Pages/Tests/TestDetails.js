
import {
    Table,
    Thead,
    Tbody,
    Button,
    Tr,
    Th,
    Td,
    TableCaption,
    Container,
    Progress,
    Text,
    Box,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../../Context/AlertContext';

function TestDetails() {
    const diaCtx= useContext(AlertContext);
    const [tests, setTests] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const getTests = (TestDetails) => {
        setIsLoading(false);
        if(TestDetails.error){
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${TestDetails.error}`);
        }
        setTests(TestDetails.data)
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            setIsLoading(true);
            window.api.getTests();
            window.api.response(getTests)
        }
        return () => {
            isApiSubscribed = false
        }
    }, [])
    return (
        <>
            <Container maxW='container.lg' centerContent>
                <Button colorScheme='gray' onClick={() => navigate('/tests/newTest')}>New Test</Button>
                {isLoading ? <Progress size='xs' isIndeterminate /> :
                    tests.length === 0 ? <Text>Sorry there are no tests to show.</Text> :
                        <Table variant='simple'>
                            <TableCaption>List of all the doctors</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th isNumeric>Cost</Th>
                                    <Th>Description</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tests.map((test) => {
                                    console.log(test)
                                    return <Tr key={test.id}>
                                        <Td color='teal'>
                                            <Box as='button' onClick={() => navigate(`/tests/editTest/${test.id}`, { state: test })}>{test.name}</Box>
                                        </Td>
                                        <Td isNumeric>{test.cost}</Td>
                                        <Td>{test.description}</Td>
                                    </Tr>
                                })

                                }
                            </Tbody>

                        </Table>
                }
            </Container>

        </>

    );
}

export default TestDetails;