const path = require('path')
const pdf = require('html-pdf');
const ejs = require('ejs')

const options = { format: 'A4' };
const billPDF = async (billsPath, currDir) => {
    ejs.renderFile(path.join('../','pdfTemplates','billPdf','billPdf.ejs'), { heading: "New Heading" }, (err, html) => {
        pdf.create(html, options).toFile(path.join(billsPath, 'bill.pdf'), (err, res)=>{
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        }); 
    });
}

const reportPDF= async (data, reportsPath, currDir)=>{
    const fileName= `reportR${data.report_id}T${data.test_name}`
    console.log(data)
    //TODO: Fix the file path issue with ejs
    let html;
    try {
        html=await ejs.renderFile(path.join(__dirname,'../','pdfTemplates','reportPdf','reportPdf.ejs'), { data: "sdfsadsdfsdafsdasadf" }, {async:true});
    } catch (error) {
        return {
            status:'FAILURE',
            error
        }
    }

    await pdf.create(html, options).toFile(path.join(reportsPath,fileName), (err, res)=>{
        if (err) {
            return {
                status:"FAILURE",
                error:err
            };
        }
        return {
            status:"SUCCESS",
            fileName
        }
    }); 
}

module.exports = {
    billPDF,
    reportPDF
}