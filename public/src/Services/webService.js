const log= require('../Services/log')
const uploadReport=(patientName, patientContactNumber, testName, filepath)=>{
  log.info(`Uploading report ${patientName} ${patientContactNumber} ${testName} ${filepath}`)
}
module.exports={
    uploadReport
}