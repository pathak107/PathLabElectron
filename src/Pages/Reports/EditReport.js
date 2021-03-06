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
    FormControl,
    FormLabel,
    Text,
    Select,
    Link,
    FormErrorMessage,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import { isRequired, Validate, Validation } from "../../helpers/validation";

function EditReport() {
    const diaCtx = useContext(AlertContext)
    const params = useParams();
    const [reportData, setReportData] = useState({
        report_id: "",
        test_name: "",
        patient_name: "",
        Patient_contact_number: "",
        date: "",
        report_PDF: "",
        status: false,
        referred_by: "",
        report_values: [],
        remarks: "",
        doctor_id: "",
    });
    const [doctors, setDoctors] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const getReportParameters = async () => {
        setIsLoading(true);
        const rp = await window.api.getReportParameters(params.reportID);
        if (rp.error || !rp.data) {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${rp.error}`);
        } else {
            console.log(rp.data.DoctorId)
            const reportValues = []
            rp.data.Test_Parameters.forEach((tp) => {
                reportValues.push({
                    para_id: tp.id,
                    name: tp.name,
                    value: tp.ReportValue.value,
                    unit: tp.unit,
                    range: tp.range,
                    description: tp.description
                })
            })
            setReportData({
                report_id: rp.data.id,
                test_name: rp.data.Test_Detail.name,
                patient_name: rp.data.Invoice.Patient.name,
                Patient_contact_number: rp.data.Invoice.Patient.contact_number,
                date: rp.data.updatedAt.toString(),
                report_PDF: rp.data.report_file_path,
                status: rp.data.completed,
                referred_by: rp.data.referred_by,
                report_values: reportValues,
                remarks: rp.data.remarks,
                doctor_id: rp.data.DoctorId
            })

        }
        setIsLoading(false)
    }

    const getDoctors = async () => {
        setIsLoading(true)
        const docs = await window.api.getDoctors()
        if (docs.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! Error in getting list of all doctors. \n ${docs.error}`);
        }
        setDoctors(docs.data)
        setIsLoading(false)
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getReportParameters()
            getDoctors()
        }
        return () => {
            isApiSubscribed = false
        }
    },
        [params.reportID])

    const submitHandler = async () => {
        const isValid= Validate(valid, {doctorID: reportData.doctor_id})
        if(!isValid.valid){
            setValid(isValid.validation)
            return
        }
        console.log(reportData)
        setIsLoading(true);
        const created = await window.api.editReport(reportData)
        setIsLoading(false);
        if (created.status === "FAILURE") {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured in updating the report. Please try again.`);
        } else {
            diaCtx.actions.showDialog("Done", `Successfully updated report.`);
        }
    }

    const launchReportPDFWindow = (fileName) => {
        window.api.launchPDFWindow(fileName,'REPORT')
    }

    const [valid, setValid]=useState(Validation([
        {
            field:"doctorID",
            validations:[isRequired]
        }
    ]))

    return (
        <>
            <Container maxW='container.lg'>
                <Heading>Edit Report</Heading>
                <Stack spacing={3}>
                    {!reportData ?
                        <Text>Nothing to show here. Maybe some error occured.</Text> :
                        <>

                            <Stack spacing={3}>
                                <Text>Report ID: #{reportData.report_id.toString()}</Text>
                                <Text>Test Name: {reportData.test_name}</Text>
                                <Text>Patient: {reportData.patient_name}</Text>
                                <Text>Patient Number: {reportData.Patient_contact_number}</Text>
                                <Text>Date: {reportData.date}</Text>
                                <Text>Report PDF: {reportData.report_PDF ?
                                    <Link onClick={() => launchReportPDFWindow(reportData.report_PDF)} color='teal.500' isExternal>
                                        {reportData.report_PDF} <ExternalLinkIcon mx='2px' />
                                    </Link> : "No report PDF generated"}</Text>
                                <Text>Status: {reportData.status ? "Done" : "Pending"}</Text>
                                <Text>Referred By: {reportData.referred_by}</Text>
                            </Stack>


                            <Table variant='simple'>
                                <TableCaption>List of all the Test Parameters</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th>Value</Th>
                                        <Th>Unit</Th>
                                        <Th>Range</Th>
                                        <Th>Description</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {reportData.report_values.map((reportValue) => {
                                        return <Tr key={reportValue.para_id}>
                                            <Td >{reportValue.name}</Td>
                                            <td>
                                                <Input
                                                    placeholder='Value'
                                                    value={reportValue.value}
                                                    onChange={(e) => {
                                                        const newReportVals = []
                                                        const newReportData = { ...reportData }
                                                        reportData.report_values.forEach((rv) => {
                                                            if (rv.para_id === reportValue.para_id) {
                                                                rv.value = e.target.value
                                                            }
                                                            newReportVals.push(rv)
                                                        })
                                                        newReportData.report_values = newReportVals
                                                        setReportData(newReportData)
                                                    }}
                                                />
                                            </td>
                                            <Td >{reportValue.unit}</Td>
                                            <Td >{reportValue.range}</Td>
                                            <Td >{reportValue.description}</Td>
                                        </Tr>
                                    })}

                                </Tbody>
                            </Table>

                            <FormControl isRequired isInvalid={valid.doctorID.isInvalid}>
                                <FormLabel htmlFor="doctor">Select Doctor</FormLabel>
                                <Select width='full'
                                    placeholder="Select Doctor"
                                    onChange={(e) => {
                                        const newReportData = { ...reportData }
                                        newReportData.doctor_id = e.target.value
                                        setReportData(newReportData)
                                        console.log(reportData.doctor_id)
                                    }}
                                    value={reportData.doctor_id}
                                >
                                    {doctors.map((doc) => {
                                        return <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    })}
                                </Select>
                                <FormErrorMessage>{valid.doctorID.errorMsg}</FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="remarks">Remarks/Feedback/Result</FormLabel>
                                <ReactQuill
                                    value={reportData.remarks}
                                    placeholder="Remarks/Feedback/Result"
                                    onChange={(value) => {
                                        const newReportData = { ...reportData }
                                        newReportData.remarks = value
                                        setReportData(newReportData)
                                    }} />
                            </FormControl>
                        </>
                    }

                    <Button isLoading={isLoading} colorScheme='gray' onClick={() => submitHandler()}>Submit</Button>
                </Stack>
            </Container>
        </>
    );
}

export default EditReport;