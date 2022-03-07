const path = require('path')
const ejs = require('ejs')
const fs= require('fs')
const {BrowserWindow} = require('electron')

const billPDF = async (billsPath, currDir) => {
    ejs.renderFile(path.join('../','pdfTemplates','billPdf','billPdf.ejs'), { heading: "New Heading" }, (err, html) => {

    });
}

const reportPDF= async (data, reportsPath, currDir)=>{
    const fileName= `reportR${data.report_id}T${data.test_name}`
    const win = new BrowserWindow({width: 800, height: 600});
    //TODO: Fix the file path issue with ejs
    let html;
    try {
        html=await ejs.renderFile(path.join(__dirname,'../','pdfTemplates','reportPdf','reportPdf.ejs'), { data: "sdfsadsdfsdafsdasadf" }, {async:true});
        win.loadURL('data:text/html;charset=utf-8,' + encodeURI(html));
    } catch (error) {
        return {
            status:'FAILURE',
            error
        }
    }

}

const launchPDFWindow= (filepath, filename)=>{
    const win = new BrowserWindow({width: 1000, height: 800});
    console.log(path.join(filepath,filename))
    win.loadURL("file://"+path.join(filepath,filename));
}

const demo= async(repPath)=>{
    const html=await ejs.renderFile(path.join(__dirname,'../','pdfTemplates','reportPdf','reportPdf.ejs'), { data: "sdfsadsdfsdafsdasadf" }, {async:true});
    fs.writeFileSync(path.join(repPath,'tempReport.html'), html)
    const win = new BrowserWindow({width: 1000, height: 800});
    await win.loadFile(path.join(repPath,'tempReport.html'))
    win.webContents.printToPDF({}).then(data => {
        fs.writeFile(path.join(repPath,'765675.pdf'), data, (error) => {
          if (error) throw error
          console.log("Wrote PDF successfully")
        })
      }).catch(error => {
        console.log(`Failed to write PDF to `, error)
      })
    win.on('closed',()=>{
        fs.unlinkSync(path.join(repPath,'tempReport.html'))
    })
    
}

module.exports = {
    billPDF,
    reportPDF,
    launchPDFWindow,
    demo
}