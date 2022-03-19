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
} from "@chakra-ui/react";
import { ArrowUpIcon } from '@chakra-ui/icons'
import { useContext, useState } from 'react'
import { AlertContext } from "../../Context/AlertContext";
import {useEffect} from 'react';

function Settings() {
    const diaCtx = useContext(AlertContext)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumbers, setContactNumbers] = useState([]);
    const [singleContactNum, setSingleContactNum] = useState('');
    const [labBanner, setLabBanner] = useState(null);
    const [currentLabBanner, setCurrentLabBanner]=useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const addContactNumber=()=>{
        const newContactNums= [...contactNumbers];
        newContactNums.push(singleContactNum)
        setContactNumbers(newContactNums);
    }

    const uploadBanner=async ()=>{
        const bannerFilePath= await window.api.uploadFile({
            type:'image'
        })
        if(bannerFilePath.status==="FAILURE"){
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in selecting the banner. Please try again.`);
        }
        setLabBanner(bannerFilePath.data);
    }

    const submitHandler = async () => {
        setIsLoading(true);
        const banner=labBanner? labBanner: currentLabBanner
        const saved=await window.api.setLabDetails({
            name,
            email,
            address,
            contactNumbers,
            labBanner:banner
        })
        setIsLoading(false)
        if(saved.status==="FAILURE"){
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in saving settings. Please try again.`);
        }else{
            diaCtx.actions.showDialog("Done", `Saved the settings successfully.`);
        }
    }

    const getLabDetails= async ()=>{
        const lab= await window.api.getLabDetails();
        if(lab.status==="FAILURE"){
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in saving settings. Please try again.`);
        }
        setName(lab.data.name)
        setAddress(lab.data.address)
        setContactNumbers(lab.data.contactNumbers)
        setEmail(lab.data.email)
        setCurrentLabBanner(lab.data.labBanner);
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

    return (
        <>
            <Container>
                <Heading>Settings</Heading>
                <Heading>Lab Settings</Heading>
                <Stack spacing={3}>
                    <FormControl>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="Contact Number">Contact Numbers: {contactNumbers.map((num)=>{
                            return num+", "
                        })}</FormLabel>
                        <HStack>
                            <Input
                                placeholder='Contact Number'
                                value={singleContactNum}
                                onChange={(e) => setSingleContactNum(e.target.value)}
                            />
                            <Button onClick={addContactNumber} colorScheme='gray'>Add</Button>
                        </HStack>
                    </FormControl>
                    <FormControl>
                            <Button leftIcon={<ArrowUpIcon />} onClick={uploadBanner} colorScheme='gray'>Upload Banner</Button>
                            <FormLabel htmlFor="Lab_Banner">File Selected: {labBanner?labBanner: 'None'}</FormLabel>
                            <FormLabel htmlFor="Current_Lab_Banner">Current Banner: {currentLabBanner?currentLabBanner: 'None'}</FormLabel>
                            <Button onClick={()=>setCurrentLabBanner(null)} colorScheme='gray'>Remove current Banner</Button>
                    </FormControl>
                    <Text>Note: If you don't provide a lab banner, the software will generate one automatically for you using the information given.</Text>
                    <FormControl>
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <Textarea placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                    </FormControl>
                    <Button isLoading={isLoading} colorScheme='gray' onClick={() => submitHandler()}>Save</Button>
                </Stack>
            </Container>
        </>
    );
}

export default Settings;