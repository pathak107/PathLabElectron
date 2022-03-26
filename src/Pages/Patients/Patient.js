
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

function Patient() {
    const diaCtx = useContext(AlertContext);
    const [patients, setPatients] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const getPatients = async () => {
        setIsLoading(true);
        const patientsData = await window.api.getPatients();
        setIsLoading(false);
        if (patientsData.error) {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${patientsData.error}`);
        }
        setPatients(patientsData.data)
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getPatients()
        }
        return () => {
            isApiSubscribed = false
        }
    }, [])
    return (
        <>
            <Container maxW='container.lg' centerContent>
                {isLoading ? <Progress size='xs' isIndeterminate /> :
                    patients.length === 0 ? <Text>Sorry there are no patients to show.</Text> :
                        <Table variant='simple'>
                            <TableCaption>List of all the Patients</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Contact Number</Th>
                                    <Th>Age</Th>
                                    <Th>Sex</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {patients.map((patient) => {
                                    return <Tr key={patient.id}>
                                        <Td color='teal'>
                                            <Box as='button' onClick={() => navigate(`/patient/${patient.id}`)}>{patient.name}</Box>
                                        </Td>
                                        <Td>{patient.contact_number}</Td>
                                        <Td>{patient.age} Yrs</Td>
                                        <Td>{patient.gender}</Td>
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

export default Patient;