const log= require('../Services/log')
const uploadReport=(patientName, patientContactNumber, testName, date, filepath)=>{
  log.info(`Uploading report ${patientName} ${patientContactNumber} ${testName} ${filepath}`)
}
module.exports={
    uploadReport
}