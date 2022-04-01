// const validation = {
//     field: {
//         value: null,
//         validations: [],
//         errorMsg: [],
//         isInvalid:false
//     }
// }

// [
//     {
//         field:"name",
//         validations:[isPhNumber, isEmail, ]
//     }
// ]


//field name should be same as that used for value
const Validation = (validArr) => {
    let validation = {};
    validArr.forEach((validObj) => {
        validation[validObj.field] = {
            value: null,
            validations: validObj.validations,
            errorMsg: [],
            isInvalid: false
        }
    })
    return validation
}

// useState does a shallow comparison, so a new object creation is necessary otherwise it will refer (reference) the same 
// object even if the value within the object changes
const fillValues = (validation, values) => {
    const newValidation={...validation} 
    for (const [key] of Object.entries(newValidation)) {
        newValidation[key].value=values[key]
    }
    return newValidation
}

const Validate = (validation, values) => {
    validation=fillValues(validation, values)
    let valid = true
    for (const [key, val] of Object.entries(validation)) {
        validation[key].errorMsg = []
        val.validations.forEach((validationFunc) => {
            const err = validationFunc(val.value)
            if (err && err !== "") {
                valid = false
                validation[key].errorMsg.push(err)
                validation[key].isInvalid = true
            }
        })
        if (validation[key].errorMsg.length === 0) {
            validation[key].errorMsg = []
            validation[key].isInvalid = false
        }
    }
    return {
        valid,
        validation
    }
}

const isRequired = (value) => {
    if (!value || value === "") {
        return "This field is required"
    }
}

const isPhoneNumber = (value) => {
    if(!value || value===""){ return}
    if(value.length !== 10|| isNaN(value) || isNaN(parseFloat(value))){
        return "Not a valid Phone Number."
    }
    return null
}

const isEmail=(value)=>{
    if(!value || value===""){return}
    if(!value.includes("@") || !value.includes(".")){
        return "Invalid Email"
    }
    const [userName, domain]=value.split("@")
    if(userName.length===0 || domain.length===0 || userName.includes(".")){
        return "Invalid Email"
    }
    if(domain.split(".")[0].length===0 || domain.split(".")[1].length===0){
        return "Invalid Email"
    }
    return null;
}

const isNumber=(value)=>{
    if(!value || value===""){return}
    if(isNaN(value)){
        return "Value should be a number."
    }
    return null;
}

const isArrNotEmpty = (arr)=>{
    if(arr && arr.length===0){
        return "List cannot be empty."
    }
}

export {
    Validate,
    Validation,
    fillValues,
    isPhoneNumber,
    isRequired,
    isArrNotEmpty,
    isEmail,
    isNumber
}