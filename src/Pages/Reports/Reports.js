
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
    Badge,
    Link
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../../Context/AlertContext';
import FilterBar from '../../Components/FilterBar';

function Reports() {
    const diaCtx = useContext(AlertContext);
    const [reports, setReports] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [filterObj, setFilterObj]=useState({filterKey:null, filterVal:""})
    const navigate = useNavigate();
    const [completedStatus, setCompletedStatus]= useState(false); // Value is irrelavant, just used to update UI on changin complete status
    const toggleReportStatus = async (completed, report_file_path, reportID) => {
        if (!completed && !report_file_path) {
            diaCtx.actions.showDialog("Fill the Report", "Sorry, can't change status to done because you haven't filled the report yet. Fill the report to generate a pdf and then try again.")
        } else {
            //send a request to toggle
            const changed= await window.api.toggleReportStatus({
                currentReportStatus: completed,
                reportID
            })
            if(changed.status==="SUCCESS"){
                setCompletedStatus(!completedStatus)
                if(completed){
                    diaCtx.actions.showDialog("Done", "Status changed to Pending, now you can edit the report.")
                }else{
                    diaCtx.actions.showDialog("Done", "Done the report is complete. The PDF URL will be sent to the patient through an SMS message")
                }
            }else{
                diaCtx.actions.showDialog("Failed", "Oops! Some error occured in completing the report. Please try again.")
            }
        }
    }

    const getReportList = async () => {
        setIsLoading(true);
        const reportList = await window.api.getReports(filterObj);
        setIsLoading(false);
        if (reportList.error) {
            diaCtx.actions.showDialog("Error", `Oops! looks like some unexpected error occured. Please try again. \n ${reportList.error}`);
        }
        console.log(reportList)
        setReports(reportList.data)
    }

    const launchReportPDFWindow=(fileName)=>{
        window.api.launchPDFWindow(fileName, 'REPORT')
    }

    const editReport= async (reportID, completed)=>{
        if(completed){
            diaCtx.actions.showDialog("Change the status","Report is already completed. Change the status to pending to edit this report.");
        }else{
            navigate(`/reports/editReport/${reportID}`)
        }
    }

    const dateString=(date)=>{
        const dateObj=new Date(date)
        return dateObj.toLocaleString();
    }

    useEffect(() => {
        let isApiSubscribed = true;
        if (isApiSubscribed) {
            getReportList()
        }
        return () => {
            isApiSubscribed = false
        }
    }, [completedStatus, filterObj])
    return (
        <>
            <Container maxW='container.xl' centerContent>
                <FilterBar
                    filterKeys={["Patient Name","Contact Number","InvoiceId", "ReportId", "PatientId", "Referring Doctor"]}
                    submitHandler={(filterKey, filterVal)=>setFilterObj({filterKey, filterVal})}
                />
                {isLoading ? <Progress size='xs' isIndeterminate /> :
                    (reports && reports.length !== 0 )?
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
                                            <Box as='button' onClick={() => navigate(`/invoice/${report.InvoiceId}`)}>Invoice#{report.InvoiceId}</Box>
                                        </Td>
                                        <Td>{report.Test_Detail.name}</Td>
                                        <Td>{report.Invoice.Patient.name}</Td>
                                        <Td>
                                            <Badge ml='1' fontSize='1em' colorScheme={report.completed ? 'green' : 'red'} as='button' onClick={() => toggleReportStatus(report.completed, report.report_file_path, report.id)}>
                                                {report.completed ? 'Done' : 'Pending'}
                                            </Badge>
                                        </Td>
                                        <Td><Button onClick={() => editReport(report.id, report.completed)}>Edit</Button></Td>
                                        <Td>{report.report_file_path ?
                                            <Link onClick={() => launchReportPDFWindow(report.report_file_path)} color='teal.500' isExternal>
                                                {report.report_file_path} <ExternalLinkIcon mx='2px' />
                                            </Link> : '___'}</Td>
                                        <Td>{dateString(report.createdAt.toString())}</Td>
                                    </Tr>
                                })
                                }
                            </Tbody>

                        </Table>:
                        <Text>Sorry no reports to show.</Text>
                        
                }
            </Container>

        </>

    );
}

export default Reports;