const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
const fs= require('fs')
const sequelize = require('./src/Database/dbConnection')
const databaseService = require('./src/Services/databaseService')
const pdfService= require('./src/Services/pdfService');
const webService= require('./src/Services/webService')
const consts= require('./src/Constants/Constants')

let win;
function createWindow() {
    let preloadScriptPath;
    if (isDev) {
        preloadScriptPath = path.join(__dirname, 'preload.js')
    } else {
        preloadScriptPath = path.join(app.getAppPath(), "preload.js")
    }
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            nativeWindowOpen: true,
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: preloadScriptPath
        }
    })
    if (isDev) {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadFile(path.join(app.getAppPath(), 'index.html'));
    }

}

// Storage Directory
let billsPath;
let reportsPath;
let signaturesPath;
const createStorageDirectory=()=>{
    const dir= path.join(app.getPath('documents'),'PathLabLite')
    // TODO: Change sync to async for better performace
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        fs.mkdirSync(path.join(dir,'Bills'));
        fs.mkdirSync(path.join(dir,'Reports')); 
        fs.mkdirSync(path.join(dir,'Signatures'));
    }
    billsPath=path.join(dir,'Bills')
    reportsPath=path.join(dir,'Reports')
    signaturesPath= path.join(dir, 'Signatures')
}


app.whenReady().then(async () => {
    createWindow()
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to database");
    } catch (err) {
        console.log(err)
    }
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
    createStorageDirectory()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})



// API interaction
ipcMain.handle("addTest", async (event, data) => {
    console.log(data);
    return await databaseService.addTest(data.name, data.cost, data.description)
});

ipcMain.handle('getTests', async (event, data) => {
    const tests = await databaseService.getTests();
    console.log(tests)
    return tests
});

ipcMain.handle('getTestParameters', async (event, testID) => {
    const testPara = await databaseService.getTestParameters(testID);
    console.log(testPara)
    return testPara
});

ipcMain.handle("addTestParameter", async (event, data) => {
    console.log(data);
    return await databaseService.addTestParameter(data.name, data.unit, data.range, data.description, data.testID);
});

ipcMain.handle("generateBill", async (event, data) => {
    console.log(data);
    const billGenerated= await databaseService.generateBill(data)
    if(billGenerated.status===consts.STATUS_SUCCESS){
        const pdf= await pdfService.printPDF(billsPath, pdfService.TYPE_BILL, billGenerated.data)
        if(pdf.status===consts.STATUS_SUCCESS){
            //TODO: If pdf is successful update the pdf filepath in invoice database
            return billGenerated
        }
        return {
            status:consts.STATUS_FAILURE,
            error:"Bill Pdf could not be generated.",
            data:null
        }
    }

    return billGenerated
});

ipcMain.handle('getReports', async (event, data) => {
    const reports = await databaseService.getReports();
    console.log(reports)
    return reports
});

ipcMain.handle('getReportParameters', async (event, reportID) => {
    const reportParas = await databaseService.getReportParameters(reportID);
    console.log(reportParas)
    return reportParas
})

ipcMain.handle('editReport', async (event,data)=>{
    const reportData= await databaseService.editReport(data)
    console.log(reportData)
    if(reportData.status===databaseService.status.FAILURE){
        //Send an error response to user
        return reportData
    }else{
        const newReportData={...reportData.data, signature: path.join(signaturesPath,'signature.jpg')}
        const reportPdf=await pdfService.printPDF(reportsPath, pdfService.TYPE_REPORT , newReportData)
        if(reportPdf.status==="SUCCESS"){
            const sd= await databaseService.saveReportPdfFileName(reportPdf.fileName, newReportData.id)
            return sd;
        }else{
            return {
                status:"FAILURE",
                error:"Pdf could not be generated",
                data: null
            }
        }
    }
})

ipcMain.on('launchReportPDFWindow', async (event, fileName)=>{
    pdfService.launchPDFWindow(reportsPath,fileName)
})

ipcMain.on('launchBillPDFWindow', async (event, fileName)=>{
    pdfService.launchPDFWindow(billsPath,fileName)
})

ipcMain.handle('toggleReportStatus', async (event, data) => {
    const statusChanged = await databaseService.toggleReportStatus(data.currentReportStatus, data.reportID);
    console.log(statusChanged)
    if(statusChanged.status==="SUCCESS"){
        if(!data.currentReportStatus){
            // Upload PDF and message the patient
            console.log("Upload PDF and message the patient")
        }
        return {
            status:"SUCCESS",
            error:"Report status updated, pdf upload and SMS will begin in background",
            data: null
        }
    }else{
        return {
            status:"FAILURE",
            error: statusChanged.error,
            data: null
        }

    }
})