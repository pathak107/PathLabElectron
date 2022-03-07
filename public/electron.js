const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
const fs= require('fs')
const sequelize = require('./src/Database/dbConnection')
const databaseService = require('./src/Services/databaseService')
const pdfService= require('./src/Services/pdfService');

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
let currDir;
const createStorageDirectory=()=>{
    const dir= path.join(app.getPath('documents'),'PathLabLite')
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        fs.mkdirSync(path.join(dir,'Bills'));
        fs.mkdirSync(path.join(dir,'Reports')); 
    }
    billsPath=path.join(dir,'Bills')
    reportsPath=path.join(dir,'Reports')
    if(isDev){
        currDir=__dirname
    }else{
        currDir=app.getAppPath();
    }

    pdfService.demo(reportsPath)
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

ipcMain.handle("generateBill", (event, data) => {
    console.log(data);
    databaseService.generateBill(data.patient_name, data.patient_contactNumber, data.total_amount, data.discount, data.referred_by, data.testList)
    //TODO: implement proper logic
    pdfService.billPDF( billsPath, currDir)
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
        const reportPdf=await pdfService.reportPDF(reportData.data, reportsPath, currDir)
        if(reportPdf.status==="SUCCESS"){
            return await databaseService.saveReportPdfFileName(reportPdf.fileName, reportData.data.report_id)
        }else{
            //TODO: Inform user pdf could not be generated
            return {
                status:"FAILURE",
                error:"Pdf could not be generated",
                data: null
            }
        }
    }
})

