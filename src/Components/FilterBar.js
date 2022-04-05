import { FormControl, Select, FormErrorMessage, HStack, Button, Input, Container }
    from "@chakra-ui/react";
import { useState } from "react";

const FilterBar = (props) => {
    const [filterKey, setFilterKey] = useState(undefined)
    const [filterVal, setFilterVal] = useState("")

    const submitHandler = () => {
        props.submitHandler(filterKey, filterVal)
    }

    return (
        <>
            <Container maxW='xl'>
                <HStack>
                    <FormControl>
                        <Select
                            placeholder="Filter Results"
                            onChange={(e) => {
                                setFilterKey(e.target.value)
                            }}
                            value={filterKey}
                        >
                            {props.filterKeys.map((fk, index) => {
                                return <option key={index} value={fk}>{fk}</option>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Input
                            width="full"
                            placeholder='Value'
                            value={filterVal}
                            onChange={(e) => {
                                setFilterVal(e.target.value)
                            }}
                        />
                    </FormControl>
                    <Button width='sm' onClick={submitHandler}>Search</Button>
                </HStack>
            </Container>
        </>
    )
}

export default FilterBar