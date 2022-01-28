const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        addTest: (data) => ipcRenderer.send('addTest', data),
        showTests: () => ipcRenderer.send('showTests'),
        response: (func) => ipcRenderer.on('fromMain', (event, ...args) => func(...args))
    }
);