const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        addTest: (data) => ipcRenderer.send('addTest', data),
        getTests: () => ipcRenderer.send('getTests'),
        getTest: (testID) => ipcRenderer.send('getTest', testID),
        getTestParameters: (testID) => ipcRenderer.send('getTestParameters', testID),
        addTestParameter: (data)=> ipcRenderer.send('addTestParameter', data),
        response: (func) => ipcRenderer.on('fromMain', (event, ...args) => func(...args))
    }
);