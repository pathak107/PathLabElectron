const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
const sequelize = require('./src/Database/dbConnection')
const databaseService=require('./src/Services/databaseService')

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
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


ipcMain.on("addTest", (event, data) => {
    console.log(data);
    databaseService.addTest(data.name, data.cost, data.description)
});

ipcMain.on('getTests', async (event, data) => {
    const tests=await databaseService.getTests();
    console.log(tests)
    win.webContents.send("fromMain", tests);
});

ipcMain.on('getTestParameters', async (event, testID) => {
    const testPara=await databaseService.getTestParameters(testID);
    console.log(testPara)
    win.webContents.send("fromMain", testPara[0].data);
});

ipcMain.on("addTestParameter", (event, data) => {
    console.log(data);
    databaseService.addTestParameter(data.name,data.unit, data.range, data.description, data.testID);
});

ipcMain.on("generateBill", (event, data) => {
    console.log(data);
    databaseService.generateBill(data.patient_name, data.patient_contactNumber, data.total_amount, data.discount, data.referred_by, data.testList)
});