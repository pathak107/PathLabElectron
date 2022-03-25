const consts = require('../Constants/Constants')
const log = require('./log');
const TestParameterModel = require('../models/Test_Parameter');
const ReportModel = require('../models/Report');
const TestDetailsModel = require('../models/Test_Details');
const InvoiceModel = require('../models/Invoice');
const PatientModel = require('../models/Patient');
const ReportValueModel = require('../models/Report_Value')
const DoctorModel = require('../models/Doctor')
const rawData = require('../RawData/RawData')

const response = (status, error, data) => {
    return {
        status: status,
        error: error,
        data: data
    }
}

let TestDetails
let TestParameter
let Patient
let Invoice
let Report
let ReportValue
let Doctor
let sequelize

const init = (sq) => {
    sequelize = sq
}

const setupModels = () => {
    TestParameter = TestParameterModel(sequelize)
    Report = ReportModel(sequelize)
    Doctor = DoctorModel(sequelize, { Report })
    TestDetails = TestDetailsModel(sequelize, { TestParameter, Report })
    Invoice = InvoiceModel(sequelize, { Report })
    Patient = PatientModel(sequelize, { Invoice })
    ReportValue = ReportValueModel(sequelize, { TestParameter, Report })
    log.info("Models setup completed successfully")
}

const setupDatabase = () => {
    try {
        const queryInterface = sequelize.getQueryInterface();
        queryInterface.bulkInsert('Test_Details', rawData.TestDetailsData);
    } catch (error) {
        log.error(`Database setup failed: ${error}`)
    }

}
const addTest = async (name, cost, description) => {
    try {
        log.info(`Adding test Data: ${name}, ${cost}, ${description}`);
        await TestDetails.create({ name, cost, description });
        return response(consts.STATUS_SUCCESS, null, null)
    } catch (error) {
        log.error(`Error occurred in adding Test Data: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }

}

const getTests = async () => {
    try {
        const tests = await TestDetails.findAll({ raw: true });
        return response(consts.STATUS_SUCCESS, null, tests)
    } catch (error) {
        log.error(`Error in getting test data: ${error}`)
        return response(consts.STATUS_FAILURE, error, [])
    }
}

const getTestParameters = async (testID) => {
    try {
        const test = await TestDetails.findOne({ where: { id: testID }, include: TestParameter })
        return response(consts.STATUS_SUCCESS, null, test.get({ plain: true }).Test_Parameters)
    } catch (error) {
        log.error(`Error in getting test parameters: ${error}`)
        return response(consts.STATUS_FAILURE, error, [])
    }
}

const addTestParameter = async (name, unit, range, description, testID) => {
    try {
        await TestParameter.create({ name, unit, range, description, TestDetailId: testID })
        return response(consts.STATUS_SUCCESS, null, null)
    } catch (error) {
        log.error(`Error in adding Test Parameter: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }

}

const generateBill = async (data) => {
    //Start Transaction
    const t = await sequelize.transaction();
    try {
        const [patient, created] = await Patient.findOrCreate({
            where: { contact_number: data.patient_contactNumber },
            defaults: {
                name: data.patient_name,
                contact_number: data.patient_contactNumber,
                age: data.age,
                gender: data.gender,
            },
            transaction: t,
        });
        log.info(`Patient created: ${created}`)
        const invoice = await Invoice.create({
            total_amount: data.total_amount,
            discount: data.discount,
            final_amount: data.total_amount - data.discount,
            PatientId: patient.get({ plain: true }).id
        }, { transaction: t })

        const reportsList = []
        const testIDs = []
        data.testList.forEach((test) => {
            reportsList.push({ referred_by: data.referred_by, InvoiceId: invoice.get({ plain: true }).id, TestDetailId: test.id })
            testIDs.push(test.id)
        })
        const reports = await Report.bulkCreate(reportsList, { transaction: t });

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
            tests.forEach((test) => {
                const t = test.get({ plain: true })
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
        await ReportValue.bulkCreate(reportValues, { transaction: t });

        const bill = {
            ...data,
            patient_id: patient.id,
            invoice_id: invoice.id,
            invoiceDate: invoice.createdAt,
            final_amount: invoice.final_amount

        }

        invoice.bill_cache=JSON.stringify(bill)
        await invoice.save({ transaction: t })

        t.commit();
        return response(consts.STATUS_SUCCESS, null, bill)
    } catch (error) {
        log.error(`Error in generating bill: ${error}`);
        t.rollback();
        return response(consts.STATUS_FAILURE, error, null)
    }
}


const getReports = async () => {
    const reports = [];
    try {
        const reportModels = await Report.findAll({ include: [{ model: Invoice, include: Patient }, { model: TestDetails }], order: [['updatedAt', 'DESC']], })
        reportModels.forEach((reportModel) => {
            reports.push(reportModel.get({ plain: true }))
        })
        return response(consts.STATUS_SUCCESS, null, reports);
    } catch (error) {
        log.error(`Error in getting reports: ${error}`)
        return response(consts.STATUS_FAILURE, error, reports)
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
                },
                Doctor
            ]
        })
        return response(consts.STATUS_SUCCESS, null, reportPara.get({ plain: true }))
    } catch (error) {
        log.error(`Error while getting report parameters: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }
}

const editReport = async (data) => {
    log.info(`Edited data for report: ${data}`)
    const t = await sequelize.transaction();
    const reportVals = []
    try {
        data.report_values.forEach((rv) => {
            reportVals.push({
                ReportId: data.report_id,
                TestParameterId: rv.para_id,
                value: rv.value
            })
        })
        log.debug("doctorID:", data.doctor_id)
        await Report.update({ remarks: data.remarks, DoctorId: data.doctor_id? data.doctor_id: null }, {
            where: {
                id: data.report_id
            },
            transaction: t
        });
        await ReportValue.bulkCreate(reportVals, { updateOnDuplicate: ["value"], transaction: t })
        t.commit();
        return getReportParameters(data.report_id)
    } catch (error) {
        t.rollback()
        log.error(`Error while editing report: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }

}

const saveReportPdfFileName = async (fileName, reportID) => {
    try {
        await Report.update({ report_file_path: fileName }, {
            where: {
                id: reportID
            }
        })
        return response(consts.STATUS_SUCCESS, null, null)
    } catch (error) {
        log.error(`Error while saving report pdf filename: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }

}

const toggleReportStatus = async (currentReportStatus, reportID) => {
    try {
        const report = await Report.findByPk(reportID, {
            include: [
                TestDetails,
                {
                    model: Invoice,
                    include: Patient,
                }
            ]
        })
        report.completed = !currentReportStatus
        await report.save()
        return response(consts.STATUS_SUCCESS, null, report.get({ plain: true }))
    } catch (error) {
        log.error(`Error while toggling report Status: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }
}


const getDoctors = async () => {
    try {
        const doctors = await Doctor.findAll({raw: true})
        return response(consts.STATUS_SUCCESS, null, doctors)
    } catch (error) {
        log.error(`Error in getting doctors: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }
}

const createDoctor = async (data) => {
    let doctorData = {
        name: data.name,
        field: data.field,
        degree: data.degree,
    }
    doctorData = data.contact_number ? { ...doctorData, contact_number: data.contact_number }: doctorData
    doctorData = data.address ? { ...doctorData, address: data.address }: doctorData
    doctorData = data.email ? { ...doctorData, email: data.address }: doctorData
    doctorData = data.signature_file_path ? { ...doctorData, signature_file_path: data.signature_file_path }: doctorData

    try {
        await Doctor.create(doctorData)
        return response(consts.STATUS_SUCCESS,  null, null)
    } catch (error) {
        log.error(`Error in creating doctor: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }
}

const updateDoctor= async (data)=>{
    let doctorData = {
        name: data.name,
        field: data.field,
        degree: data.degree,
        contact_number: data.contact_number,
        address: data.address,
        email: data.email,
        signature_file_path: data.signature_file_path
    }
    try {
        await Doctor.update(doctorData, {
            where: {
                id: data.id
            }
        })
        return response(consts.STATUS_SUCCESS, null, null)
    } catch (error) {
        log.error(`Error in updating doctor: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
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
    toggleReportStatus,
    setupModels,
    getDoctors,
    createDoctor,
    updateDoctor,
    init,
    setupDatabase
}