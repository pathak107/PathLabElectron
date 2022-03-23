const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
const fs = require('fs')
const pdfService = require('./src/Services/pdfService');
const storage = require('./src/Services/localStorage');
const consts = require('./src/Constants/Constants')
const { dialog } = require('electron')
const { autoUpdater } = require("electron-updater")
const databaseService = require('./src/Services/databaseService')
const log = require('./src/Services/log');
const sqlite3= require('sqlite3')
const {Sequelize}= require('sequelize')

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
let storageDir;
const createStorageDirectory = () => {
    storageDir = path.join(app.getPath('documents'), 'PathLabLite')
    // TODO: Change sync to async for better performace
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir);
        fs.mkdirSync(path.join(storageDir, 'Bills'));
        fs.mkdirSync(path.join(storageDir, 'Reports'));
        fs.mkdirSync(path.join(storageDir, 'Signatures'));
    }
    billsPath = path.join(storageDir, 'Bills')
    reportsPath = path.join(storageDir, 'Reports')
    signaturesPath = path.join(storageDir, 'Signatures')
}


app.whenReady().then(async () => {
    // Create the storage directory 
    createStorageDirectory()
    
    // Configure database
    let sequelize
    const dbFile = path.join(app.getPath('documents'), 'PathLabLite', 'labTest.db')
    if (!fs.existsSync(dbFile)) {
        new sqlite3.Database(dbFile, async(err) => {
            if (err) {
                return log.error(err);
            }
            log.info("labTest.db does not exists, created a new one file")
            sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: dbFile,
                logging: msg => log.debug(msg),
                define: {
                    freezeTableName: true
                }
            });
            databaseService.init(sequelize)
            databaseService.setupModels()
            await sequelize.sync({ force: true });
            databaseService.setupDatabase();
            createWindow()
            // try {
            //     await sequelize.authenticate();
            //     log.info("SuccessfcreateWindow()createWindow()ully connected to database")
            // } catch (err) {
            //     log.error(err)
            // }
        });
    } else {
        log.info("labTest.db exists.")
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbFile,
            logging: msg => log.debug(msg),
            define: {
                freezeTableName: true
            }
        });
        databaseService.init(sequelize)
        databaseService.setupModels()
        createWindow()
    }
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    try {
        autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
        log.error(`AutoUpdater error: ${error}`)
    }

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})



// API interaction
const response = (status, error, data) => {
    return {
        status,
        error,
        data
    }
}
ipcMain.handle("addTest", async (event, data) => {
    return await databaseService.addTest(data.name, data.cost, data.description)
});

ipcMain.handle('getTests', async (event, data) => {
    const tests = await databaseService.getTests();
    return tests
});

ipcMain.handle('getTestParameters', async (event, testID) => {
    const testPara = await databaseService.getTestParameters(testID);
    return testPara
});

ipcMain.handle("addTestParameter", async (event, data) => {
    return await databaseService.addTestParameter(data.name, data.unit, data.range, data.description, data.testID);
});

ipcMain.handle("generateBill", async (event, data) => {
    const billGenerated = await databaseService.generateBill(data)
    if (billGenerated.status === consts.STATUS_SUCCESS) {
        const pdf = await pdfService.printPDF(billsPath, pdfService.TYPE_BILL, billGenerated.data)
        if (pdf.status === consts.STATUS_SUCCESS) {
            //TODO: If pdf is successful update the pdf filepath in invoice database
            return billGenerated
        }
        return {
            status: consts.STATUS_FAILURE,
            error: "Bill Pdf could not be generated.",
            data: null
        }
    }

    return billGenerated
});

ipcMain.handle('getReports', async (event, data) => {
    const reports = await databaseService.getReports();
    return reports
});

ipcMain.handle('getReportParameters', async (event, reportID) => {
    const reportParas = await databaseService.getReportParameters(reportID);
    return reportParas
})

ipcMain.handle('editReport', async (event, data) => {
    const reportData = await databaseService.editReport(data)
    if (reportData.status === databaseService.status.FAILURE) {
        //Send an error response to user
        return reportData
    } else {
        const labSettings = storage.getLabDetails();
        const newReportData = { ...reportData.data, signature: path.join(signaturesPath, 'signature.jpg'), labDetails: labSettings }
        const reportPdf = await pdfService.printPDF(reportsPath, pdfService.TYPE_REPORT, newReportData)
        if (reportPdf.status === "SUCCESS") {
            const sd = await databaseService.saveReportPdfFileName(reportPdf.fileName, newReportData.id)
            return sd;
        } else {
            return {
                status: "FAILURE",
                error: "Pdf could not be generated",
                data: null
            }
        }
    }
})

ipcMain.on('launchReportPDFWindow', async (event, fileName) => {
    pdfService.launchPDFWindow(reportsPath, fileName)
})

ipcMain.on('launchBillPDFWindow', async (event, fileName) => {
    pdfService.launchPDFWindow(billsPath, fileName)
})

ipcMain.handle('toggleReportStatus', async (event, data) => {
    const statusChanged = await databaseService.toggleReportStatus(data.currentReportStatus, data.reportID);
    if (statusChanged.status === "SUCCESS") {
        if (!data.currentReportStatus) {
            // Upload PDF and message the patient
        }
        return {
            status: "SUCCESS",
            error: "Report status updated, pdf upload and SMS will begin in background",
            data: null
        }
    } else {
        return {
            status: "FAILURE",
            error: statusChanged.error,
            data: null
        }

    }
})

ipcMain.handle('uploadFile', async (event, data) => {
    try {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openFile',],
            filters: [
                { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
            ]
        })
        return response(consts.STATUS_SUCCESS, null, result.filePaths[0])
    } catch (error) {
        return response(consts.STATUS_FAILURE, error, null)
    }
})

ipcMain.handle('setLabDetails', async (event, data) => {
    try {
        let bannerFilePath = null;
        if (data.labBanner) {
            bannerFilePath = path.join(storageDir, "lab_banner" + path.extname(data.labBanner))
            fs.copyFileSync(data.labBanner, bannerFilePath)
        }
        storage.setLabDetails(data.name, data.address, data.contactNumbers, data.email, bannerFilePath)
        return response(consts.STATUS_SUCCESS, null, null)
    } catch (error) {
        log.error(error)
        return response(consts.STATUS_FAILURE, error, null)
    }
})

ipcMain.handle('getLabDetails', async (event, data) => {
    try {
        const labSettings = storage.getLabDetails();
        return response(consts.STATUS_SUCCESS, null, labSettings)

    } catch (error) {
        return response(consts.STATUS_FAILURE, error, null)
    }
})