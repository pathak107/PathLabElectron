const sequelize = require('../Database/dbConnection');
const TestDetails = require('../models/Test_Details');
const TestParameter = require('../models/Test_Parameter');
const Patient = require('../models/Patient');
const Invoice = require('../models/Invoice');
const Report = require('../models/Report');


const status = {
    SUCCESS: 'success',
    FAILURE: 'failure',
};
Object.freeze(status);

const response = (status, error, data) => {
    return {
        status: status,
        error: error,
        data: data
    }
}

const addTest = async (name, cost, description) => {
    await TestDetails.create({ name, cost, description });
}

const getTests = async () => {
    try {
        const tests = await TestDetails.findAll({ raw: true });
        return response(status.SUCCESS, null, tests)
    } catch (error) {
        return response(status.FAILURE, error, [])
    }
}

const getTestParameters = async (testID) => {
    try {
        const test = await TestDetails.findOne({ where: { id: testID }, include: TestParameter })
        return response(status.SUCCESS, null, test.get({ plain: true }).Test_Parameters)
    } catch (error) {
        return response(status.FAILURE, error, [])
    }
}

const addTestParameter = async (name, unit, range, description, testID) => {
    await TestParameter.create({ name, unit, range, description, TestDetailId: testID })
}

const generateBill = async (patient_name, patient_contactNumber, total_amount, discount, referred_by, testList) => {
    //TODO: Implement transactions here.
    const [patient, created] = await Patient.findOrCreate({
        where: { contact_number: patient_contactNumber },
        defaults: {
            name: patient_name,
            contact_number: patient_contactNumber
        }
    });
    const invoice= await Invoice.create({
        total_amount: total_amount,
        discount: discount,
        final_amount: total_amount - discount,
        PatientId: patient.get({plain:true}).id
    })
  
    const reportsList=[]
    testList.forEach((test)=>{
        reportsList.push({ referred_by: referred_by,  InvoiceId: invoice.get({plain:true}).id, TestDetailId: test.id})
    })
    await Report.bulkCreate(reportsList);
}

module.exports = {
    addTest,
    getTests,
    getTestParameters,
    addTestParameter,
    generateBill,
}