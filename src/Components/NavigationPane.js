import { Box, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react'
function NavigationPane() {
    const navigate = useNavigate()
    return (
        <>
            <Box bg="#011627" height="full">
                <VStack  textColor="white">
                    <Table size='lg'>
                        <Thead>
                            <Tr>
                                <Th textColor="white">Quick Navigation</Th>
                            </Tr>
                        </Thead>
                        <Tbody border="bisque">
                            <Tr>
                                <Td><Box onClick={() => navigate('/')} as='button'>Home</Box></Td>
                            </Tr>
                            <Tr>
                                <Td><Box onClick={() => navigate('/patient')} as='button'>Patients</Box></Td>
                            </Tr>
                            <Tr>
                                <Td><Box onClick={() => navigate('/invoice')} as='button'>Invoice</Box></Td>
                            </Tr>
                            <Tr>
                                <Td><Box onClick={() => navigate('/reports')} as='button'>Reports</Box></Td>
                            </Tr>
                            <Tr>
                                <Td><Box onClick={() => navigate('/tests')} as='button'>Tests</Box></Td>
                            </Tr>
                            <Tr>
                                <Td><Box onClick={() => navigate('/doctor')} as='button'>Doctors</Box></Td>
                            </Tr>
                            <Tr>
                                <Td><Box onClick={() => navigate('/settings')} as='button'>Settings</Box></Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </VStack>
            </Box>
        </>

    );
}

export default NavigationPane;