const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const log = require('./log')
const { BrowserWindow } = require('electron')

const TYPE_REPORT="REPORT"
const TYPE_BILL="BILL"

const printPDF= async (storagePath, type, data)=>{
    let fileName="";
    let templatePath;
    log.info("Data to be written into PDF: ", data);
    log.info("Type of data = ", type)
    if(type===TYPE_REPORT){
        const createdDate= new Date(data.createdAt)
        const updatedDate= new Date(data.updatedAt)
        data.createdAt= createdDate.toLocaleString();
        data.updatedAt= updatedDate.toLocaleString();
        templatePath= path.join(__dirname, '../', 'pdfTemplates', 'reportPdf', 'reportPdf.ejs')
        fileName = `reportR${data.id}T${data.Test_Detail.id}-${Date.now()}.pdf`
    }else if(type===TYPE_BILL){
        const date= new Date(data.invoiceDate)
        data.invoiceDate=date.toLocaleString();
        templatePath= path.join(__dirname, '../', 'pdfTemplates', 'billPdf', 'billPdf.ejs')
        fileName = `BillB${data.invoice_id}-${Date.now()}.pdf`
    }

    log.info("Template Path: ", templatePath)
    log.info("FileName : ", fileName)

    try {
        //Convert ejs to html and fill the data
        const html = await ejs.renderFile(templatePath, { data: data }, { async: true });

        //Write the html into a temporary html file
        fs.writeFileSync(path.join(storagePath, 'temp.html'), html)

        // Load the temporary html into a new browser window
        const win = new BrowserWindow({ width: 1000, height: 800 , show:false, webPreferences: {
            nodeIntegration: false,
            nativeWindowOpen: true,
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
        }});
        await win.loadFile(path.join(storagePath, 'temp.html'))

        // Print the browser window and write the data into a pdf file
        const pdfData = await win.webContents.printToPDF({})
        fs.writeFileSync(path.join(storagePath, fileName), pdfData)
        log.info("Wrote PDF successfully")

        //Once the window closes delete the temporary html file
        win.close()
        fs.unlink(path.join(storagePath, 'temp.html'),(err)=>{
            throw err
        })
        launchPDFWindow(storagePath, fileName);

        return {
            status: 'SUCCESS',
            error: null,
            fileName
        }
    } catch (error) {
        log.error("Error in generating PDF: ", error)
        return {
            status: 'FAILURE',
            error,
            fileName: null
        }
    }
}


const launchPDFWindow = (filepath, filename) => {
    try {
        const win = new BrowserWindow({ width: 1000, height: 800, webPreferences:{nativeWindowOpen:true} });
        log.info("Launching PDF at path: ", path.join(filepath, filename))
        win.loadURL("file://" + path.join(filepath, filename));
    } catch (error) {
        log.error("Error in launching PDF: ",error)
    }

}


module.exports = {
    printPDF,
    TYPE_BILL,
    TYPE_REPORT,
    launchPDFWindow,
}