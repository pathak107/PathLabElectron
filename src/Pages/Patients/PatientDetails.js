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
    Progress,
    FormControl,
    FormLabel,
    Textarea,
    Text,
    Spinner,
    Box,
    Select,
    Badge,
    Link,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";

function PatientDetails() {
    const diaCtx = useContext(AlertContext)
    const navigate = useNavigate()
    const params = useParams();
    const [patient, setPatient] = useState({
        name: null,
        contact_number: null,
        email: null,
        age: null,
        weight: null,
        gender: null,
    });
    const [reports, setReports] = useState([])
    const [bills, setBills] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [completedStatus, setCompletedStatus]= useState(false); // Value is irrelavant, just used to update UI on changin complete status

    const getPatientDetails = async () => {
        setIsLoading(true);
        const patientData = await window.api.getPatientDetails(params.patient_id);
        if (patientData.error || !patientData.data) {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${patientData.error}`);
        } else {
            setReports(patientData.data.reports)
            setBills(patientData.data.invoices)
            setPatient({
                name: patientData.data.patient.name,
                gender: patientData.data.patient.gender,
                contact_number: patientData.data.patient.contact_number,
                age: patientData.data.patient.age,
                weight: patientData.data.patient.weight,
                email: patientData.data.patient.email,
            })

        }
        setIsLoading(false)
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getPatientDetails(params.patient_id)
        }
        return () => {
            isApiSubscribed = false
        }
    },
        [completedStatus])

    const submitHandler = async () => {
        setIsLoading(true);
        const created = await window.api.updatePatient(patient, params.patient_id)
        setIsLoading(false);
        if (created.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in updating the patient data. Please try again.`);
        } else {
            diaCtx.actions.showDialog("Done", `Successfully updated Patient Information.`);
        }
    }

    const editReport = async (reportID, completed) => {
        if (completed) {
            diaCtx.actions.showDialog("Change the status", "Report is already completed. Change the status to pending to edit this report.");
        } else {
            navigate(`/reports/editReport/${reportID}`)
        }
    }

    const dateString = (date) => {
        const dateObj = new Date(date)
        return dateObj.toLocaleString();
    }
    const launchReportPDFWindow = (fileName) => {
        window.api.launchPDFWindow(fileName,'REPORT')
    }

    const toggleReportStatus = async (completed, report_file_path, reportID) => {
        if (!completed && !report_file_path) {
            diaCtx.actions.showDialog("Fill the Report", "Sorry, can't change status to done because you haven't filled the report yet. Fill the report to generate a pdf and then try again.")
        } else {
            //send a request to toggle
            const changed = await window.api.toggleReportStatus({
                currentReportStatus: completed,
                reportID
            })
            if (changed.status === "SUCCESS") {
                setCompletedStatus(!completedStatus)
                if (completed) {
                    diaCtx.actions.showDialog("Done", "Status changed to Pending, now you can edit the report.")
                } else {
                    diaCtx.actions.showDialog("Done", "Done the report is complete. The PDF URL will be sent to the patient through an SMS message")
                }
            } else {
                diaCtx.actions.showDialog("Failed", "Oops! Some error occured in completing the report. Please try again.")
            }
        }
    }

    return (
        <>
            <Container maxW='container.lg'>
                <Heading>Patient Details</Heading>
                <Stack spacing={3}>
                    {!patient ?
                        <Text>Nothing to show here. Maybe some error occured.</Text> :
                        <>

                            <Stack spacing={3}>
                                <Text>Patient ID: #P{params.patient_id}</Text>
                                <Text>Contact Number: {patient.contact_number}</Text>
                                <FormControl>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <Input
                                        placeholder='Name'
                                        value={patient.name}
                                        onChange={(e) => {
                                            const newPatientData = { ...patient }
                                            newPatientData.name = e.target.value
                                            setPatient(newPatientData)
                                        }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="age">Age</FormLabel>
                                    <Input
                                        placeholder='Age'
                                        value={patient.age}
                                        onChange={(e) => {
                                            const newPatientData = { ...patient }
                                            newPatientData.age = e.target.value
                                            setPatient(newPatientData)
                                        }}
                                    />
                                </FormControl>
                                <FormLabel htmlFor="sex">Sex</FormLabel>
                                <Select width='full'
                                    onChange={(e) => {
                                        const newPatientData = { ...patient }
                                        newPatientData.gender = e.target.value
                                        setPatient(newPatientData)
                                    }}
                                    value={patient.gender}
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </Select>
                                <FormControl>
                                    <FormLabel htmlFor="weight">Weight</FormLabel>
                                    <Input
                                        placeholder='Weight'
                                        value={patient.weight}
                                        onChange={(e) => {
                                            const newPatientData = { ...patient }
                                            newPatientData.weight = e.target.value
                                            setPatient(newPatientData)
                                        }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="Email">Email</FormLabel>
                                    <Input
                                        placeholder='Email'
                                        value={patient.email}
                                        onChange={(e) => {
                                            const newPatientData = { ...patient }
                                            newPatientData.email = e.target.value
                                            setPatient(newPatientData)
                                        }}
                                    />
                                </FormControl>
                                <Button isLoading={isLoading} colorScheme='gray' onClick={() => submitHandler()}>Save</Button>
                            </Stack>
                            <Tabs isFitted variant='enclosed'>
                                <TabList mb='1em'>
                                    <Tab>Reports</Tab>
                                    <Tab>Bills</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Table variant='simple'>
                                            <TableCaption>List of all the reports</TableCaption>
                                            <Thead>
                                                <Tr>
                                                    <Th>Report PDF</Th>
                                                    <Th>Status</Th>
                                                    <Th>Edit Report</Th>
                                                    <Th>Date</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {reports.map((report) => {
                                                    return <Tr key={report.id}>
                                                        <Td>{report.report_file_path ?
                                                            <Link onClick={() => launchReportPDFWindow(report.report_file_path)} color='teal.500' isExternal>
                                                                {report.report_file_path} <ExternalLinkIcon mx='2px' />
                                                            </Link> : '___'}
                                                        </Td>
                                                        <Td>
                                                            <Badge ml='1' fontSize='1em' colorScheme={report.completed ? 'green' : 'red'} as='button' onClick={() => toggleReportStatus(report.completed, report.report_file_path, report.id)}>
                                                                {report.completed ? 'Done' : 'Pending'}
                                                            </Badge>
                                                        </Td>
                                                        <Td><Button onClick={() => editReport(report.id, report.completed)}>Edit</Button></Td>

                                                        <Td>{dateString(report.createdAt.toString())}</Td>
                                                    </Tr>
                                                })
                                                }
                                            </Tbody>

                                        </Table>
                                    </TabPanel>
                                    <TabPanel>
                                        <Table variant='simple'>
                                            <TableCaption>List of all the Invoie</TableCaption>
                                            <Thead>
                                                <Tr>
                                                    <Th>Invoice ID</Th>
                                                    <Th>Final Amount</Th>
                                                    <Th>Date</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {bills.map((bill) => {
                                                    return <Tr key={bill.id}>
                                                        <Td color='teal'>
                                                            <Box as='button' onClick={() => navigate(`/invoice/${bill.id}`)}>Invoice#{bill.id}</Box>
                                                        </Td>
                                                        <Td>₹{bill.final_amount}</Td>
                                                        <Td>{(dateString(bill.updatedAt))}</Td>
                                                    </Tr>
                                                })

                                                }
                                            </Tbody>

                                        </Table>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </>
                    }


                </Stack>
            </Container>
        </>
    );
}

export default PatientDetails;