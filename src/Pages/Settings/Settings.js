import {
    Stack,
    Input,
    Button,
    Container,
    Textarea,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Text,
    Box,
    Image,
    FormErrorMessage,
} from "@chakra-ui/react";
import { ArrowUpIcon } from '@chakra-ui/icons'
import { useContext, useState } from 'react'
import { AlertContext } from "../../Context/AlertContext";
import { useEffect } from 'react';
import { isArrNotEmpty, isEmail, isRequired, Validate, Validation } from "../../helpers/validation";

function Settings() {
    const diaCtx = useContext(AlertContext)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumbers, setContactNumbers] = useState([]);
    const [singleContactNum, setSingleContactNum] = useState('');
    const [labBanner, setLabBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const addContactNumber = () => {
        const newContactNums = [...contactNumbers];
        newContactNums.push(singleContactNum)
        setContactNumbers(newContactNums);
    }

    const uploadBanner = async () => {
        const bannerFilePath = await window.api.uploadFile({
            type: 'image'
        })
        if (bannerFilePath.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in selecting the banner. Please try again.`);
        }
        setLabBanner(bannerFilePath.data);
    }

    const submitHandler = async () => {
        const isValid= Validate(valid, {name, contactNumbers, address, email})
        if(!isValid.valid){
            setValid(isValid.validation)
            return
        }
        setIsLoading(true);
        const saved = await window.api.setLabDetails({
            name,
            email,
            address,
            contactNumbers,
            labBanner
        })
        setIsLoading(false)
        if (saved.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in saving settings. Please try again.`);
        } else {
            diaCtx.actions.showDialog("Done", `Saved the settings successfully.`);
        }
    }

    const getLabDetails = async () => {
        const lab = await window.api.getLabDetails();
        if (lab.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in saving settings. Please try again.`);
        }
        setName(lab.data.name)
        setAddress(lab.data.address)
        setContactNumbers(lab.data.contactNumbers)
        setEmail(lab.data.email)
        setLabBanner(lab.data.labBanner);
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getLabDetails();
        }
        return () => {
            isApiSubscribed = false
        }
    }, [])


    const [valid, setValid]=useState(Validation([
        {
            field:"name",
            validations:[isRequired]
        },
        {
            field:"contactNumbers",
            validations:[isArrNotEmpty]
        },
        {
            field:"address",
            validations:[isRequired]
        },
        {
            field:"email",
            validations:[isEmail]
        }
    ]))

    return (
        <>
            <Container>
                <Heading>Settings</Heading>
                <Heading>Lab Settings</Heading>
                <Stack spacing={3}>
                    <FormControl isRequired isInvalid={valid.name.isInvalid}>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <FormErrorMessage>{valid.name.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={valid.email.isInvalid}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormErrorMessage>{valid.email.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={valid.contactNumbers.isInvalid}>
                        <FormLabel htmlFor="Contact Number">Contact Numbers: {contactNumbers.map((num) => {
                            return num + ", "
                        })}</FormLabel>
                        <HStack>
                            <Input
                                placeholder='Contact Number'
                                value={singleContactNum}
                                onChange={(e) => setSingleContactNum(e.target.value)}
                            />
                            <Button onClick={addContactNumber} colorScheme='gray'>Add</Button>
                        </HStack>
                        <FormErrorMessage>{valid.contactNumbers.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={valid.address.isInvalid}>
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <Textarea placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                        <FormErrorMessage>{valid.address.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <Button leftIcon={<ArrowUpIcon />} onClick={uploadBanner} colorScheme='gray'>Upload Banner</Button>
                        <Text>Note: If you don't provide a lab banner, the software will generate a basic one automatically for you using the information given above.</Text>
                        <Box boxSize='xs'>
                            <Image src={labBanner ? `media://${labBanner}` : `none`} alt='Banner preview' />
                        </Box>
                        <Button onClick={() => setLabBanner(null)} colorScheme='gray'>Remove current Banner</Button>
                    </FormControl>


                    <Button isLoading={isLoading} colorScheme='gray' onClick={() => submitHandler()}>Save</Button>
                </Stack>
            </Container>
        </>
    );
}

export default Settings;