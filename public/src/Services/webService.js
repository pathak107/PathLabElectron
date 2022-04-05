const log= require('../Services/log')
const uploadReport=(patientName, patientContactNumber, testName, date, filepath)=>{
  // Get lab details here
  log.info(`Uploading report ${patientName} ${patientContactNumber} ${testName} ${filepath}`)
}
module.exports={
    uploadReport
}