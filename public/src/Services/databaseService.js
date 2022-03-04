const sequelize = require('../Database/dbConnection');
const TestDetails = require('../models/Test_Details');
const TestParameter = require('../models/Test_Parameter');

const addTest = async (name, cost, description) => {
    await TestDetails.create({ name, cost, description });
}

const getTests = async () => {
    const tests = await TestDetails.findAll({ raw: true });
    return tests;
}

const getTestParameters = async (testID) => {
    const test = await TestDetails.findOne({where:{id:testID}, include: TestParameter})
    return test.get({plain:true}).Test_Parameters
}

const addTestParameter = async (name, unit, range, description, testID)=>{
    await TestParameter.create({name,unit,range, description , TestDetailId: testID})
}

module.exports = {
    addTest,
    getTests,
    getTestParameters,
    addTestParameter,
}