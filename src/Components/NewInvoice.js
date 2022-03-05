import {
    Input,
    Button,
    Heading, VStack, InputGroup, InputLeftElement, Select, Box
} from '@chakra-ui/react'
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel
} from '@chakra-ui/react'
import { PhoneIcon } from '@chakra-ui/icons'
import { useContext, useState } from 'react'
import { BillContext } from '../Context/BillContextProvider'
const NewInvoice = () => {
    const billCtx = useContext(BillContext)
    const [singleTestID, setSingleTestID] = useState('');
    return (
        <>
            <Box borderWidth='1px' borderRadius='lg' width='lg' p={5}>
                <VStack spacing='5'>
                    <Heading size='md'>New Invoice</Heading>
                    <Input placeholder="Patient's Name"
                        value={billCtx.state.name} onChange={(e) => {
                            billCtx.actions.setName(e.target.value);
                        }} />
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents='none'
                            children={<PhoneIcon color='gray.300' />}
                        />
                        <Input type='tel' placeholder='Phone number' value={billCtx.state.contactNumber} onChange={(e) => {
                            billCtx.actions.setContactNumber(e.target.value);
                        }} />
                    </InputGroup>

                    <Select width='full' placeholder='Select Test'
                        onChange={(e) => {
                            setSingleTestID(e.target.value)
                        }}
                        value={singleTestID}
                    >
                        {billCtx.state.allTests.map((test) => {
                            return <option key={test.id} value={test.id}>{test.name}</option>
                        })}
                    </Select>
                    <Button width='full' onClick={() => {
                        billCtx.actions.addTest(singleTestID);
                    }}>
                        Add Test
                    </Button>

                    <Input placeholder="Referred by Doctor" value={billCtx.state.doctor} onChange={(e) => {
                        billCtx.actions.setDoctor(e.target.value);
                    }} />
                    <FormControl>
                        <FormLabel htmlFor='Discount'>Discount</FormLabel>
                        <NumberInput
                            value={billCtx.state.discount}
                            onChange={(discount) => {
                                billCtx.actions.setDiscount(discount);
                            }}
                            min={0}
                            max={billCtx.state.totalAmt}
                        >
                            <NumberInputField placeholder='Discount' />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <Button
                        colorScheme='gray'
                        width='full'
                        onClick={() => {
                            billCtx.actions.submitHandler()
                        }}
                    >
                        Generate Bill
                    </Button>
                </VStack>

            </Box>

        </>
    );
}

export default NewInvoice;