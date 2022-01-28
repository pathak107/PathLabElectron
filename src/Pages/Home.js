import { SimpleGrid, Container, Button, Text, Divider } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
function Home() {
    const navigate= useNavigate();
    return (
        <Container>
            <Text>Your one stop solution for everything path lab test related</Text>
            <Divider/>
            <Text>Quicly Navigate</Text>
            <SimpleGrid columns={2} spacing={10}>
                <Button onClick={()=>navigate('/doctors')}>Doctors</Button>
                <Button>Patients</Button>
                <Button>Test Cost</Button>
                <Button>Test Records</Button>
            </SimpleGrid>
        </Container>

    );
}

export default Home;