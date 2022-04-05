
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
import FilterBar from '../../Components/FilterBar';
import { AlertContext } from '../../Context/AlertContext';

function Invoice() {
    const diaCtx = useContext(AlertContext);
    const [bills, setBills] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [filterObj, setFilterObj]= useState({
        filterKey:null,
        filterVal:""
    })
    const navigate = useNavigate();
    const getInvoices = async () => {
        setIsLoading(true);
        const billsList = await window.api.getInvoices(filterObj);
        setIsLoading(false);
        if (billsList.error) {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${billsList.error}`);
        }
        setBills(billsList.data)
    }

    const dateString=(date)=>{
        const dateStr= new Date(date)
        return dateStr.toLocaleString()
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getInvoices()
        }
        return () => {
            isApiSubscribed = false
        }
    }, [filterObj])
    return (
        <>
            <Container maxW='container.lg' centerContent>
                <FilterBar
                    filterKeys={["InvoiceId", "Patient Name", "Contact Number", "PatientId"]}
                    submitHandler={(filterKey, filterVal)=>setFilterObj({filterKey, filterVal})}
                />
                {isLoading ? <Progress size='xs' isIndeterminate /> :
                    (bills && bills.length !== 0) ?
                        <Table variant='simple'>
                            <TableCaption>List of all the Invoie</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Invoice ID</Th>
                                    <Th>Patient Name</Th>
                                    <Th>Patient M.Number</Th>
                                    <Th>Total Amount</Th>
                                    <Th>Date</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {bills.map((bill) => {
                                    return <Tr key={bill.id}>
                                        <Td color='teal'>
                                            <Box as='button' onClick={() => navigate(`/invoice/${bill.id}`)}>Invoice#{bill.id}</Box>
                                        </Td>
                                        <Td>{bill.bill_cache.patient_name}</Td>
                                        <Td>{bill.bill_cache.patient_contactNumber}</Td>
                                        <Td>₹{bill.final_amount}</Td>
                                        <Td>{(dateString(bill.updatedAt))}</Td>
                                    </Tr>
                                })

                                }
                            </Tbody>

                        </Table>: <Text>Sorry there are no inovice to show.</Text>
                }
            </Container>

        </>

    );
}

export default Invoice;