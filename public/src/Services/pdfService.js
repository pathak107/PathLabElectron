const fs = require('fs');
const path = require('path')
const pdf = require('html-pdf');
const ejs = require('ejs')

const options = { format: 'A4' };
const billPDF = async (htmlPath, pdfFilePath) => {
    ejs.renderFile(path.join(htmlPath, 'public', 'billPdf.ejs'), { heading: "New Heading" }, (err, html) => {
        pdf.create(html, options).toFile(path.join(pdfFilePath, 'bill.pdf'), function (err, res) {
            if (err) return console.log(err);
            console.log(res); // { filename: '/app/businesscard.pdf' }
        }); 
    });

}

module.exports = {
    billPDF,
}