const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const { BrowserWindow } = require('electron')

const TYPE_REPORT="REPORT"
const TYPE_BILL="BILL"

const printPDF= async (storagePath, type, data)=>{
    let fileName="";
    let templatePath;
    console.log(data);
    if(type===TYPE_REPORT){
        templatePath= path.join(__dirname, '../', 'pdfTemplates', 'reportPdf', 'reportPdf.ejs')
        fileName = `reportR${data.report_id}T${data.test_name}.pdf`
    }else if(type===TYPE_BILL){
        templatePath= path.join(__dirname, '../', 'pdfTemplates', 'billPdf', 'billPdf.ejs')
        fileName = `BillB${1}T${2}.pdf`
    }

    try {
        //Convert ejs to html and fill the data
        const html = await ejs.renderFile(templatePath, { data: "sdfsadsdfsdafsdasadf" }, { async: true });

        //Write the html into a temporary html file
        fs.writeFileSync(path.join(storagePath, 'temp.html'), html)

        // Load the temporary html into a new browser window
        const win = new BrowserWindow({ width: 1000, height: 800 , show:false});
        await win.loadFile(path.join(storagePath, 'temp.html'))

        // Print the browser window and write the data into a pdf file
        const data = await win.webContents.printToPDF({})
        fs.writeFileSync(path.join(storagePath, fileName), data)
        console.log("Wrote PDF successfully")

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
        console.log(error)
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
        console.log(path.join(filepath, filename))
        win.loadURL("file://" + path.join(filepath, filename));
    } catch (error) {
        console.log(error)
    }

}


module.exports = {
    printPDF,
    TYPE_BILL,
    TYPE_REPORT,
    launchPDFWindow,
}