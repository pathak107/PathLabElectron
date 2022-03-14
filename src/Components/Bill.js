import { Heading, Text, VStack } from "@chakra-ui/react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    IconButton,Box
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { useContext } from "react";
import { BillContext } from "../Context/BillContextProvider";

function Bill() {
    const billCtx = useContext(BillContext);
    return (
        <>
            <Box borderWidth='1px' borderRadius='lg' width='lg' p={5}>
                <VStack spacing={5}>
                    <Heading size='md'>Bill</Heading>
                    <Text fontSize='lg'>Patient's Name: {billCtx.state.name}</Text>
                    <Text fontSize='lg'>Contact Number: {billCtx.state.contactNumber}</Text>
                    <Text fontSize='lg'>Age: {billCtx.state.age}</Text>
                    <Text fontSize='lg'>Gender: {billCtx.state.gender}</Text>
                    <Table variant='simple' size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Test Name</Th>
                                <Th>Cost(INR)</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {billCtx.state.tests.map((test, index) => {
                                return <Tr key={index}>
                                    <Td>{test.name}</Td>
                                    <Td>{test.cost}
                                        <IconButton size='sm' aria-label='Delete' icon={<DeleteIcon />}
                                            onClick={() => {
                                                billCtx.actions.removeTest(test.id)
                                            }}
                                        /></Td>
                                </Tr>
                            })}

                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Td>Total</Td>
                                <Td>{billCtx.state.totalAmt}</Td>
                            </Tr>
                            <Tr>
                                <Td>Discount</Td>
                                <Td>{billCtx.state.discount}</Td>
                            </Tr>
                            <Tr>
                                <Td>GST</Td>
                                <Td>100</Td>
                            </Tr>
                            <Tr>
                                <Td>SGST</Td>
                                <Td>100</Td>
                            </Tr>
                            <Tr>
                                <Td>Final Amount</Td>
                                <Td>{billCtx.state.totalAmt - billCtx.state.discount}</Td>
                            </Tr>
                        </Tfoot>
                    </Table>
                </VStack>
            </Box>

        </>
    );
}

export default Bill;