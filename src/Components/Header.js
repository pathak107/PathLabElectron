import { Center, Heading, HStack, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons"
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <>
            <Center>
                <HStack align='stretch'>
                    {location.pathname === '/' ? <div /> : <IconButton
                        colorScheme='gray'
                        aria-label='Back Button'
                        size='lg'
                        icon={<ArrowBackIcon />}
                        onClick={() => {
                            navigate(-1)
                        }}
                    />}

                    <Heading>PathLabLight</Heading>

                </HStack>
            </Center>
        </>
    );
}

export default Header;