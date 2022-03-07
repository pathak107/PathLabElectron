const sequelize = require('../Database/dbConnection');
const isDev = require('electron-is-dev');
const TestDetails = require('../models/Test_Details');
const TestParameter = require('../models/Test_Parameter');
const Patient = require('../models/Patient');
const Invoice = require('../models/Invoice');
const Report = require('../models/Report');
const ReportValue = require('../models/Report_Value')

if (isDev) {
    (async () => {
        try {
            await sequelize.sync({ alter: true });
        } catch (error) {
            console.log(error)
        }
        // Code here
    })();
}

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
    try {
        await TestDetails.create({ name, cost, description });
        return response(status.SUCCESS, null, null)
    } catch (error) {
        return response(status.FAILURE, error, null)
    }
    
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
    try {
        await TestParameter.create({ name, unit, range, description, TestDetailId: testID })
        return response(status.SUCCESS, null, null)
    } catch (error) {
        return response(status.FAILURE, error, null)
    }
    
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
    const invoice = await Invoice.create({
        total_amount: total_amount,
        discount: discount,
        final_amount: total_amount - discount,
        PatientId: patient.get({ plain: true }).id
    })

    const reportsList = []
    const testIDs = []
    testList.forEach((test) => {
        reportsList.push({ referred_by: referred_by, InvoiceId: invoice.get({ plain: true }).id, TestDetailId: test.id })
        testIDs.push(test.id)
    })
    const reports = await Report.bulkCreate(reportsList);

    // Creation of REPORT VALUES Table
    const tests = await TestDetails.findAll({
        where: {
            id: testIDs
        },
        include: TestParameter
    })
    const reportValues = [] // {reportId:'2', parameterId:'5'}
    reports.forEach((report) => {
        const r = report.get({ plain: true })
        console.log(r)
        tests.forEach((test) => {
            const t = test.get({ plain: true })
            console.log(t)
            if (t.id === r.TestDetailId) {
                t.Test_Parameters.forEach((tp) => {
                    reportValues.push({
                        ReportId: r.id,
                        TestParameterId: tp.id
                    })
                })
            }
        })
    })
    console.log(reportValues)
    try {
        const reportV = await ReportValue.bulkCreate(reportValues);
        console.log(reportV);
    } catch (error) {
        console.log(error)
    }


}


const getReports = async () => {
    const reports = [];
    try {
        const reportModels = await Report.findAll({ include: [{ model: Invoice, include: Patient }, { model: TestDetails }] })
        reportModels.forEach((reportModel) => {
            reports.push(reportModel.get({ plain: true }))
        })
        return response(status.SUCCESS, null, reports);
    } catch (error) {
        return response(status.FAILURE, error, reports)
    }
}

const getReportParameters = async (reportID) => {
    try {
        const reportPara = await Report.findByPk(reportID, {
            include: [
                TestParameter,
                TestDetails,
                {
                    model: Invoice,
                    include: Patient,
                }
            ]
        })
        return response(status.SUCCESS, null, reportPara.get({ plain: true }))
    } catch (error) {
        return response(status.FAILURE, error, null)
    }
}

const editReport = async (data) => {
    console.log(data)
    const reportVals = []
    try {
        data.report_values.forEach((rv) => {
            reportVals.push({
                ReportId: data.report_id,
                TestParameterId: rv.para_id,
                value:rv.value
            })
        })
        console.log(reportVals)
        await ReportValue.bulkCreate(reportVals, { updateOnDuplicate: ["value"] })
        //TODO: Better implementation for date
        data.date=Date.now()
        return response(status.SUCCESS, null, data)
    } catch (error) {
        return response(status.FAILURE, error, null)
    }

}

const saveReportPdfFileName=async (fileName, reportID)=>{
    try {
        await Report.update({report_file_path: fileName},{
            where:{
                id:reportID
            }
        })
        return response(status.SUCCESS, null, null)
    } catch (error) {
        return response(status.FAILURE, error, null)
    }
    
}

module.exports = {
    addTest,
    getTests,
    getTestParameters,
    addTestParameter,
    generateBill,
    getReports,
    getReportParameters,
    editReport,
    saveReportPdfFileName,
    status
}