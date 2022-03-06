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
    Text

} from "@chakra-ui/react";
import { useContext, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { AlertContext } from "../../Context/AlertContext";

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
        report_values: []
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            setIsLoading(true);
            window.api.getReportParameters(params.reportID);
            window.api.response((rp) => {
                if (rp.error || !rp.data) {
                    diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${rp.error}`);
                } else {
                    const reportValues=[]
                    rp.data.Test_Parameters.forEach((tp)=>{
                        reportValues.push({
                            para_id:tp.id,
                            name:tp.name,
                            value:tp.ReportValue.value,
                            unit:tp.unit,
                            range: tp.range,
                            description:tp.description
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
                        report_values: reportValues
                    })

                }

            })
            setIsLoading(false)
        }
        return () => {
            isApiSubscribed = false
        }
    },
        [params.reportID])

    const submitHandler = () => {
        window.api.editReport(reportData)
    }

    return (
        <>
            <Container maxW='container.lg'>
                <Heading>Edit Report</Heading>
                <Stack spacing={3}>
                    {!reportData ?
                        <Text>Some error occured.</Text> :
                        <Stack spacing={3}>
                            <Text>Report ID: #{reportData.report_id.toString()}</Text>
                            <Text>Test Name: {reportData.test_name}</Text>
                            <Text>Patient: {reportData.patient_name}</Text>
                            <Text>Patient Number: {reportData.Patient_contact_number}</Text>
                            <Text>Date: {reportData.date}</Text>
                            <Text>Report PDF: {reportData.report_PDF ? reportData.report_PDF : "No report PDF generated"}</Text>
                            <Text>Status: {reportData.status ? "Done" : "Pending"}</Text>
                            <Text>Referred By: {reportData.referred_by}</Text>
                        </Stack>

                    }
                    {isLoading ? <Progress isIndeterminate size='xs' /> :
                        reportData.report_values.length === 0 ? <Text>Sorry this report has no test parameters</Text> :
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
                                                    onChange={(e) =>{
                                                        const newReportVals=[]
                                                        const newReportData={...reportData}
                                                        reportData.report_values.forEach((rv)=>{
                                                            if(rv.para_id===reportValue.para_id){
                                                                rv.value=e.target.value
                                                            }
                                                            newReportVals.push(rv)
                                                        })
                                                        newReportData.report_values=newReportVals
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

                    }
                    <Button colorScheme='gray' onClick={() => submitHandler()}>Submit</Button>
                </Stack>
            </Container>
        </>
    );
}

export default EditReport;