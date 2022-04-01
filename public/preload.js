const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        addTest: (data) => ipcRenderer.invoke('addTest', data),
        getTests: () => ipcRenderer.invoke('getTests'),
        getTest: (testID) => ipcRenderer.invoke('getTest', testID),
        getTestParameters: (testID) => ipcRenderer.invoke('getTestParameters', testID),
        addTestParameter: (data)=> ipcRenderer.invoke('addTestParameter', data),
        generateBill: (data)=> ipcRenderer.invoke('generateBill', data),
        getReports:()=>ipcRenderer.invoke('getReports'),
        getReportParameters:(reportID)=>ipcRenderer.invoke('getReportParameters', reportID),
        editReport: (reportData)=> ipcRenderer.invoke('editReport', reportData),
        launchPDFWindow: (fileName, type)=>ipcRenderer.send('launchPDFWindow', fileName, type),
        toggleReportStatus: (data)=> ipcRenderer.invoke('toggleReportStatus', data),
        uploadFile: (data)=>ipcRenderer.invoke('uploadFile', data),
        setLabDetails: (data)=> ipcRenderer.invoke('setLabDetails', data),
        getLabDetails: ()=> ipcRenderer.invoke('getLabDetails'),
        getDoctors: ()=> ipcRenderer.invoke('getDoctors'),
        createDoctor: (data)=> ipcRenderer.invoke('createDoctor', data),
        updateDoctor:(data)=> ipcRenderer.invoke('updateDoctor', data),
        getInvoices:()=>ipcRenderer.invoke('getInvoices'),
        getInvoice:(invoice_id)=>ipcRenderer.invoke('getInvoice', invoice_id),
        getPatients:()=>ipcRenderer.invoke('getPatients'),
        getPatientDetails: (patient_id)=> ipcRenderer.invoke('getPatientDetails', patient_id),
        updatePatient:(data, patient_id)=> ipcRenderer.invoke('updatePatient', data, patient_id),
        updateTest: (data)=>ipcRenderer.invoke('updateTest', data)
    }
);