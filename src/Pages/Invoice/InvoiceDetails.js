import {
    Stack,
    Input,
    Button,
    Container,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Text,
    Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useParams} from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AlertContext } from "../../Context/AlertContext";

function InvoiceDetails() {
    const [bill, setBill]= useState(null)
    const params= useParams();
    const diaCtx= useContext(AlertContext)
    const [isLoading, setIsLoading]=useState(false);

    const launchPDFWindow = (fileName) => {
        window.api.launchPDFWindow(fileName,'BILL')
    }

    const getInvoice = async () => {
        setIsLoading(true);
        const res = await window.api.getInvoice(params.invoice_id)
        if (res.error) {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${res.error}`);
        }
        setBill(res.data)
        setIsLoading(false)
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getInvoice()
        }
        return () => {
            isApiSubscribed = false
        }
    },
        [])

    const dateString=(date)=>{
        const dateObj= new Date(date)
        return dateObj.toLocaleString()
    }

    return (
        <>
            <Container maxW='container.lg'>
                <Heading>Bill Details</Heading>
                <Stack spacing={3}>
                    {!bill ?
                        <Text>Nothing to show here. Maybe some error occured.</Text> :
                        <>

                            <Stack spacing={3}>
                                <Text>Report ID: Invoice#{bill.id.toString()}</Text>
                                <Text>Patient Name: {bill.bill_cache.patient_name}</Text>
                                <Text>Patient Number: {bill.bill_cache.patient_contactNumber}</Text>
                                <Text>Age: {bill.bill_cache.age}</Text>
                                <Text>Sex: {bill.bill_cache.gender}</Text>
                                <Text>Date: {dateString(bill.bill_cache.invoiceDate)}</Text>
                                <Text>Total Amount: ₹{bill.bill_cache.total_amount}</Text>
                                <Text>Discount: ₹{bill.bill_cache.discount}</Text>
                                <Text>Final Amount: ₹{bill.bill_cache.final_amount}</Text>
                                <Text>Referred By: {bill.bill_cache.referred_by}</Text>
                                <Text>Bill PDF: {bill.bill_file_path ?
                                    <Link onClick={() => launchPDFWindow(bill.bill_file_path)} color='teal.500' isExternal>
                                        {bill.bill_file_path} <ExternalLinkIcon mx='2px' />
                                    </Link> : "No Bill PDF available"}</Text>
                            </Stack>


                            <Table variant='simple'>
                                <TableCaption>Test Details</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th>Cost</Th>
                                        <Th>Description</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {bill.bill_cache.testList.map((test) => {
                                        return <Tr key={test.id}>
                                            <Td >{test.name}</Td>
                                            <Td >{test.cost}</Td>
                                            <Td >{test.description}</Td>
                                        </Tr>
                                    })}

                                </Tbody>
                            </Table>
                        </>
                    }
                </Stack>
            </Container>
        </>
    );
}

export default InvoiceDetails;