const { app, BrowserWindow, ipcMain, protocol, Menu } = require('electron')
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
const sqlite3 = require('sqlite3')
const { Sequelize } = require('sequelize')
const webService = require('./src/Services/webService')

//Auto updater logging configureation
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"


const isMac = process.platform === 'darwin'

const template = [
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    { role: 'editMenu' },
    {
        label: 'View',
        submenu: isDev ? [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ] :
            [
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
    },
    { role: 'windowMenu' },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

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

    // Registering media protocol to resolve to absolute path for local images
    protocol.registerFileProtocol('media', (request, callback) => {
        const pathname = decodeURI(request.url.replace('media://', ''));
        callback(pathname);
    });

    // Configure database
    let sequelize
    const dbFile = path.join(app.getPath('documents'), 'PathLabLite', 'labTest.db')
    if (!fs.existsSync(dbFile)) {
        new sqlite3.Database(dbFile, async (err) => {
            if (err) {
                return log.error(`Error occured in creating database: ${err}`);
            }
            log.info("labTest.db does not exists, created a new one file")
            sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: dbFile,
                logging: msg => log.silly(msg),
                define: {
                    freezeTableName: true
                }
            });
            databaseService.init(sequelize)
            databaseService.setupModels()
            await sequelize.sync({ force: true });
            await databaseService.setupDatabase();
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
            logging: msg => log.silly(msg),
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
    return await databaseService.addTest(data.name, data.cost, data.description, data.TestParameters)
});

ipcMain.handle("updateTest", async (event, data) => {
    return await databaseService.updateTest(data.name, data.cost, data.desc, data.testID)
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
        const labSettings = storage.getLabDetails();
        const newBillData = { ...billGenerated.data, labDetails: labSettings }
        const pdf = await pdfService.printPDF(billsPath, pdfService.TYPE_BILL, newBillData)
        if (pdf.status === consts.STATUS_SUCCESS) {
            //If pdf is successful update the pdf filepath in invoice database
            return await databaseService.saveBillPdfFileName(pdf.fileName, billGenerated.data.invoice_id)
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
    if (reportData.status === consts.FAILURE) {
        //Send an error response to user
        return reportData
    } else {
        const labSettings = storage.getLabDetails();
        const newReportData = { ...reportData.data, labDetails: labSettings }
        const reportPdf = await pdfService.printPDF(reportsPath, pdfService.TYPE_REPORT, newReportData)
        if (reportPdf.status === "SUCCESS") {
            return await databaseService.saveReportPdfFileName(reportPdf.fileName, newReportData.id)
        } else {
            return {
                status: "FAILURE",
                error: "Pdf could not be generated",
                data: null
            }
        }
    }
})

ipcMain.on('launchPDFWindow', async (event, fileName, type) => {
    if (type === consts.TYPE_BILL) {
        pdfService.launchPDFWindow(billsPath, fileName)
    } else {
        pdfService.launchPDFWindow(reportsPath, fileName)
    }
})

ipcMain.handle('toggleReportStatus', async (event, data) => {
    const statusChanged = await databaseService.toggleReportStatus(data.currentReportStatus, data.reportID);
    if (statusChanged.status === "SUCCESS") {
        if (!data.currentReportStatus) {
            // Status changed to done so upload PDF and message the patient
            const report = statusChanged.data
            log.debug(report)
            webService.uploadReport(
                report.Invoice.Patient.name,
                report.Invoice.Patient.contact_number,
                report.Test_Detail.name,
                report.updatedAt,
                path.join(reportsPath, report.report_file_path)
            )
        }
        return {
            status: "SUCCESS",
            error: "Report status updated, pdf upload and SMS to patient will begin in background",
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
        log.error(`Error in setting lab details: ${error}`)
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

ipcMain.handle('getDoctors', async (event, data) => {
    return await databaseService.getDoctors()
})

ipcMain.handle('createDoctor', async (event, data) => {
    try {
        let signatureFilePath = null;
        if (data.signature_file_path) {
            signatureFilePath = path.join(signaturesPath, `signD-${data.name}${Date.now()}` + path.extname(data.signature_file_path))
            fs.copyFileSync(data.signature_file_path, signatureFilePath)
            data.signature_file_path = signatureFilePath
        }
        return await databaseService.createDoctor(data)
    } catch (error) {
        log.error(`Error in creating doctor: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }
})

ipcMain.handle('updateDoctor', async (event, data) => {
    try {
        let signatureFilePath = null;
        if (data.signature_file_path && !fs.existsSync(data.signature_file_path)) {
            signatureFilePath = path.join(signaturesPath, `signD-${data.name}${Date.now()}` + path.extname(data.signature_file_path))
            fs.copyFileSync(data.signature_file_path, signatureFilePath)
            data.signature_file_path = signatureFilePath
        }
        return await databaseService.updateDoctor(data)
    } catch (error) {
        log.error(`Error in creating doctor: ${error}`)
        return response(consts.STATUS_FAILURE, error, null)
    }
})


ipcMain.handle('getInvoices', async (event, data) => {
    return await databaseService.getInvoices();
})

ipcMain.handle('getInvoice', async (event, invoice_id) => {
    return await databaseService.getInvoice(invoice_id);
})

ipcMain.handle('getPatients', async (event, data) => {
    return await databaseService.getPatients();
})

ipcMain.handle('getPatientDetails', async (event, patient_id) => {
    return await databaseService.getPatientDetails(patient_id)
})

ipcMain.handle('updatePatient', async (event, data, patient_id) => {
    return await databaseService.updatePatient(data, patient_id)
})