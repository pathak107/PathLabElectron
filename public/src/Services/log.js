const log = require('electron-log');
const config= require('../../config.json')
const isDev= require('electron-is-dev')
const localStorage=require('./localStorage');
const labDetails= localStorage.getLabDetails()

//Remote logging configuration
log.transports.remote.level = 'info';
log.transports.remote.url = `${config.LOGGER_URL}/log`
log.transports.remote.requestOptions={
    headers:{
        "access_token":config.LOGGER_ACCESS_TOKEN
    }
}
log.transports.remote.transformBody=(data)=>{
    const newData={...data, lab_details:labDetails}
    return JSON.stringify(newData)
}

if (!isDev){
    log.transports.console.level = false;
}

module.exports=log