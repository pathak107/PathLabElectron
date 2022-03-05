import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Stack,
    Input,
    Button
  } from '@chakra-ui/react'
import { useContext} from 'react';
import { TestParaContext } from '../../Context/TestParaContext';


function AddTestParameterModal() {
    const ctx = useContext(TestParaContext);
    return (
      <>
        <Modal isOpen={ctx.state.isOpen} onClose={()=>ctx.actions.setIsOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Test Parameter</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Stack spacing={3}>
                    <Input placeholder='Name' onChange={(e)=>ctx.actions.setName(e.target.value)} value={ctx.state.name}/>
                    <Input placeholder='Unit' onChange={(e)=>ctx.actions.setUnit(e.target.value)} value={ctx.state.unit}/>
                    <Input placeholder='Normal Range' onChange={(e)=>ctx.actions.setRange(e.target.value)} value={ctx.state.range} />
                    <Input placeholder='Description'  onChange={(e)=>ctx.actions.setDescription(e.target.value)} value={ctx.state.description}/>
                </Stack>
            </ModalBody>
            <ModalFooter>
            <Button variant='ghost' onClick={ctx.actions.addTestParameter}>Save</Button>
            <Button colorScheme='blue' mr={3} onClick={()=>ctx.actions.setIsOpen(false)}>
                Close
            </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default AddTestParameterModal;