import { SimpleGrid, Container, Button, Text, Divider, HStack, Flex } from '@chakra-ui/react'
import Bill from '../Components/Bill';
import NewInvoice from '../Components/NewInvoice';
import { BillContextProvider } from '../Context/BillContextProvider';

function Home() {
    return (
        <BillContextProvider>
            <Container maxW='container.xl'>
                <Flex direction='row'>
                    <NewInvoice />
                    <Bill />
                </Flex>
            </Container>
        </BillContextProvider>
    );
}

export default Home;