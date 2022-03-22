const { Sequelize } = require('sequelize')
const isDev = require('electron-is-dev');
const path = require('path')
const log = require('electron-log')

let dbFile;
if (isDev) {
    dbFile = path.join(__dirname, '../../labTest.db')
} else {
    dbFile = path.join(process.resourcesPath, '/labTest.db').replace('/app.asar', '');
    log.info("Path to database: ", path.join(process.resourcesPath, '/labTest.db').replace('/app.asar', ''))
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFile,
    logging: msg=> log.debug(msg),
    define: {
        freezeTableName: true
    }
});

module.exports = sequelize;


