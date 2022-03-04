const { Sequelize } = require('sequelize')
const isDev = require('electron-is-dev');
const path = require('path')

let dbFile;
if (isDev) {
    dbFile = path.join(__dirname, '../../../labTest.db')
} else {
    dbFile = path.join(process.resourcesPath, '/labTest.db').replace('/app.asar', '');
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFile,
    define: {
        freezeTableName: true
    }
});

if (isDev) {
    (async () => {
        await sequelize.sync({ alter: true });
        // Code here
    })();
}

module.exports = sequelize;


