
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
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

function Doctors() {
    const navigate=useNavigate();
    return (
        <>
            <Container maxW='container.lg' centerContent>
                <Button colorScheme='gray' onClick={()=>navigate('/doctors/newDoctor')}>New Doctor</Button>
                <Table variant='simple'>
                    <TableCaption>List of all the doctors</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Field</Th>
                            <Th isNumeric>Contact Number</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Dheeraj</Td>
                            <Td>MD</Td>
                            <Td isNumeric>8130180208</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Container>

        </>

    );
}

export default Doctors;