import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button
} from '@chakra-ui/react'
import { useContext } from 'react'
import { AlertContext } from '../../Context/AlertContext'

function Alert() {
    const ctx= useContext(AlertContext)

    return (
        <>
            <AlertDialog
                motionPreset='slideInBottom'
                onClose={()=>ctx.actions.setIsOpen(false)}
                isOpen={ctx.state.isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>{ctx.state.heading}</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {ctx.state.message}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onClick={()=>ctx.actions.setIsOpen(false)}>
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default Alert;


