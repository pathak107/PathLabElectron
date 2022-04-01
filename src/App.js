import Header from "./Components/Header";
import Doctors from "./Pages/Doctors/Doctors";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom"
import NewDoctor from "./Pages/Doctors/NewDoctor";
import { Box, Flex } from "@chakra-ui/react";
import NavigationPane from "./Components/NavigationPane";
import TestDetails from "./Pages/Tests/TestDetails";
import NewTest from "./Pages/Tests/NewTest";
import EditTest from "./Pages/Tests/EditTest";
import { TestParaContextProvider } from "./Context/TestParaContext";
import Reports from "./Pages/Reports/Reports";
import EditReport from "./Pages/Reports/EditReport";
import Settings from "./Pages/Settings/Settings";
import EditDoctor from "./Pages/Doctors/EditDoctor";
import Invoice from "./Pages/Invoice/Invoice";
import InvoiceDetails from "./Pages/Invoice/InvoiceDetails";
import Patient from "./Pages/Patients/Patient";
import PatientDetails from "./Pages/Patients/PatientDetails";

function App() {
  return (
    <div>
      <Header />
      <Box height='10' />
      <Flex>
        <NavigationPane />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor" element={<Doctors />} />
          <Route path="/doctor/newDoctor" element={<NewDoctor />} />
          <Route path="/doctor/editDoctor/:docID" element={<EditDoctor />} />

          <Route path="/tests" element={<TestDetails />} />
          <Route path="/tests/newTest" element={<TestParaContextProvider><NewTest /></TestParaContextProvider>} />
          <Route path="/tests/editTest/:testID" element={<TestParaContextProvider><EditTest /></TestParaContextProvider>} />

          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/editReport/:reportID" element={<EditReport />} />

          <Route path="/patient" element={<Patient />} />
          <Route path="/patient/:patient_id" element={<PatientDetails />} />

          <Route path="/invoice" element={<Invoice />} />
          <Route path="/invoice/:invoice_id" element={<InvoiceDetails />} />

          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Flex>
    </div>
  );
}

export default App;
