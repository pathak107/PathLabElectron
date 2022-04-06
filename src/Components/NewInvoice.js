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
    FormErrorMessage,
    FormLabel
} from '@chakra-ui/react'
import ReactSelect from 'react-select'
import AsyncSelect, { useAsync } from 'react-select/async';

import { PhoneIcon, SearchIcon } from '@chakra-ui/icons'
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
                    <FormControl>
                        <AsyncSelect
                            placeholder="Search Patient with Contact Number"
                            defaultOptions={true}
                            loadOptions={async (val) => {
                                const patientData = await window.api.getPatients({ filterKey: "Contact Number", filterVal: val })
                                const options = []
                                patientData.data.forEach((patient) => {
                                    options.push({ value: patient, label: patient.name })
                                })
                                return options
                            }}
                            onChange={(option) => {
                                if (option) {
                                    const patient = option.value
                                    billCtx.actions.setName(patient.name);
                                    billCtx.actions.setContactNumber(patient.contact_number);
                                    billCtx.actions.setAge(patient.age);
                                    billCtx.actions.setGender(patient.gender);
                                } else {
                                    billCtx.actions.setName("");
                                    billCtx.actions.setContactNumber("");
                                    billCtx.actions.setAge(0);
                                    billCtx.actions.setGender("MALE");
                                }
                            }}
                            isClearable={true}
                            noOptionsMessage={() => "No Patient with this contact number"}
                        />
                    </FormControl>
                    <FormControl isRequired={true} isInvalid={billCtx.state.valid.name.isInvalid}>
                        <FormLabel htmlFor='name'>Patient Name</FormLabel>
                        <Input id='name' placeholder="Patient's Name"
                            value={billCtx.state.name} onChange={(e) => {
                                billCtx.actions.setName(e.target.value);
                            }}
                        />
                        <FormErrorMessage>{billCtx.state.valid.name.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired={true} isInvalid={billCtx.state.valid.contactNumber.isInvalid}>
                        <FormLabel htmlFor='name'>Contact Number</FormLabel>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'
                                children={<PhoneIcon color='gray.300' />}
                            />
                            <Input type='tel' placeholder='Phone number' value={billCtx.state.contactNumber} onChange={(e) => {
                                billCtx.actions.setContactNumber(e.target.value);
                            }} />
                        </InputGroup>
                        <FormErrorMessage>{billCtx.state.valid.contactNumber.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor='Age'>Age</FormLabel>
                        <NumberInput
                            value={billCtx.state.age}
                            onChange={(age) => {
                                billCtx.actions.setAge(age);
                            }}
                            min={1}
                            max={100}
                        >
                            <NumberInputField placeholder='Age' />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <Select width='full'
                        onChange={(e) => {
                            billCtx.actions.setGender(e.target.value)
                        }}
                        value={billCtx.state.gender}
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </Select>
                    <FormControl isRequired={true} isInvalid={billCtx.state.valid.tests.isInvalid}>
                        <FormLabel htmlFor='tests'>Add Tests</FormLabel>
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
                        <FormErrorMessage>{billCtx.state.valid.tests.errorMsg}</FormErrorMessage>
                    </FormControl>
                    <Button width='full' onClick={() => {
                        billCtx.actions.addTest(singleTestID);
                    }}>
                        Add Test
                    </Button>

                    <FormControl isRequired={true} isInvalid={billCtx.state.valid.doctor.isInvalid}>
                        <FormLabel htmlFor='referred by'>Referred by doctor name / self</FormLabel>
                        <Input placeholder="Referred by Doctor" value={billCtx.state.doctor} onChange={(e) => {
                            billCtx.actions.setDoctor(e.target.value);
                        }} />
                        <FormErrorMessage>{billCtx.state.valid.doctor.errorMsg}</FormErrorMessage>
                    </FormControl>
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
                        isLoading={billCtx.state.isLoading}
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