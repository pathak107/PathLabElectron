
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

function Doctors() {
    const diaCtx = useContext(AlertContext);
    const [doctors, setDoctors] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const getDoctors = async () => {
        setIsLoading(true);
        const docs = await window.api.getDoctors();
        setIsLoading(false);
        if (docs.error) {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${docs.error}`);
        }
        setDoctors(docs.data)
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getDoctors()
        }
        return () => {
            isApiSubscribed = false
        }
    }, [])
    return (
        <>
            <Container maxW='container.lg' centerContent>
                <Button colorScheme='gray' onClick={() => navigate('/doctor/newDoctor')}>New Doctor</Button>
                {isLoading ? <Progress size='xs' isIndeterminate /> :
                    doctors.length === 0 ? <Text>Sorry there are no doctors to show.</Text> :
                        <Table variant='simple'>
                            <TableCaption>List of all the doctors</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th isNumeric>Degree</Th>
                                    <Th>Field</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {doctors.map((doc) => {
                                    return <Tr key={doc.id}>
                                        <Td color='teal'>
                                            <Box as='button' onClick={() => navigate(`/doctor/editDoctor/${doc.id}`, { state: doc })}>{doc.name}</Box>
                                        </Td>
                                        <Td isNumeric>{doc.degree}</Td>
                                        <Td>{doc.field}</Td>
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

export default Doctors;