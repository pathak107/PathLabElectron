import Header from "./Components/Header";
import Doctors from "./Pages/Doctors/Doctors";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom"
import NewDoctor from "./Pages/Doctors/NewDoctor";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import NavigationPane from "./Components/NavigationPane";
import TestDetails from "./Pages/Tests/TestDetails";
import NewTest from "./Pages/Tests/NewTest";
import EditTest from "./Pages/Tests/EditTest";
import { TestParaContextProvider } from "./Context/TestParaContext";

function App() {
  return (
    <div>
      <Header />
      <Box height='10' />
      <Flex>
        <NavigationPane />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/newDoctor" element={<NewDoctor />} />
          <Route path="/tests" element={<TestDetails />} />
          <Route path="/tests/newTest" element={<NewTest />} />
          <Route path="/tests/editTest/:testID" element={<TestParaContextProvider><EditTest /></TestParaContextProvider> } />
        </Routes>
      </Flex>
    </div>
  );
}

export default App;