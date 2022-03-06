
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
    Badge
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../../Context/AlertContext';

function Reports() {
    const diaCtx = useContext(AlertContext);
    const [reports, setReports] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toggleReportStatus = (completed, report_file_path) => {
        if (completed) {
            // send a request to change completed to false
        } else if (!completed && !report_file_path) {
            diaCtx.actions.showDialog("Fill the Report", "Sorry, can't change status to done because you haven't filled the report yet. Fill the report to generate a pdf and then try again.")
        } else{
            //send a request to change completed to true
        }
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            setIsLoading(true);
            window.api.getReports();
            window.api.response((reportList) => {
                setIsLoading(false);
                if (reportList.error) {
                    diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${reportList.error}`);
                }
                setReports(reportList.data)
            })
        }
        return () => {
            isApiSubscribed = false
        }
    }, [])
    return (
        <>
            <Container maxW='container.lg' centerContent>
                {isLoading ? <Progress size='xs' isIndeterminate /> :
                    reports.length === 0 ? <Text>Sorry there are no reports to show.</Text> :
                        <Table variant='simple'>
                            <TableCaption>List of all the reports</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Invoice ID</Th>
                                    <Th>Test</Th>
                                    <Th>Patient</Th>
                                    <Th>Status</Th>
                                    <Th>Fill Report</Th>
                                    <Th>Report PDF</Th>
                                    <Th>Date</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {reports.map((report) => {
                                    console.log(report)
                                    return <Tr key={report.id}>
                                        <Td color='teal'>
                                            <Box as='button' onClick={() => navigate(`/invoice/billPdf/${report.InvoiceId}`)}>{report.InvoiceId}</Box>
                                        </Td>
                                        <Td>{report.Test_Detail.name}</Td>
                                        <Td>{report.Invoice.Patient.name}</Td>
                                        <Td>
                                            <Badge ml='1' fontSize='1em' colorScheme={report.completed ? 'green' : 'red'} as='button' onClick={()=> toggleReportStatus(report.completed, report.report_file_path)}>
                                                {report.completed ? 'Done' : 'Pending'}
                                            </Badge>
                                        </Td>
                                        <Td><Button onClick={() => navigate(`/reports/editReport/${report.id}`)}>Edit</Button></Td>
                                        <Td>{report.report_file_path ? report.report_file_path : '___'}</Td>
                                        <Td>{report.createdAt.toString()}</Td>
                                    </Tr>
                                })
                                }
                            </Tbody>

                        </Table>
                }
            </Container>

        </>

    );
}

export default Reports;