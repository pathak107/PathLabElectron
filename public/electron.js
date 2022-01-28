const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
const sequelize=require('./src/Database/dbConnection')

let preloadScriptPath;
if (isDev) {
    preloadScriptPath = path.join(__dirname, 'preload.js')
} else {
    preloadScriptPath = path.join(app.getAppPath(), "preload.js")
}

let win;
function createWindow() {
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
    try{
        await sequelize.authenticate();
        console.log("Successfully connected to database");
    }catch(err){
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
});

ipcMain.on('showTests', (event, data) => {
    console.log('sdf')
    // db.all('select * from Test', (err, rows) => {
    //     if (err) console.log(err);
    //     console.log(rows);
    //     win.webContents.send("fromMain", rows);
    // })
});