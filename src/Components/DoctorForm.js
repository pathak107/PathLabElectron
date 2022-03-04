import { Button, Input, Stack } from "@chakra-ui/react"
function DoctorForm() {
    return (
        <>
            <Stack spacing={3}>
                <Input placeholder='Name' />
                <Input placeholder='Field' />
                <Input placeholder='Contact Number' />
                <Input placeholder='Address'  />
                <Button colorScheme='gray'>Submit</Button>
            </Stack>
        </>
    );
}

export default DoctorForm;