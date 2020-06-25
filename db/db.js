// ==========MongoDB===========
const mongoose = require('mongoose')
const infoDebugger = require('debug')('app:info')
const configDebugger = require('debug')('app:config')
const errDebugger = require('debug')('app:err')
const config = require('config')

const mongoConfig ={
    useNewUrlParser:true,
    useUnifiedTopology:true
}
mongoose.connect(config.get('nosql_uri'), mongoConfig)
    .then(() => configDebugger(`Connected to ${config.get('nosql_uri')}`))
    .catch(err => errDebugger(err))

mongoose.set('useFindAndModify', false);

// // ==========Sequelize===========
// const Sequelize = require('sequelize');
// const config = require('config')
// const DISABLE_SEQUELIZE_DEFAULTS = {
//     timestamps: false,
//     freezeTableName: true
// }
// const { DataTypes } = Sequelize

// const sequelize = new Sequelize({
//     database: config.get('database'),
//     host: config.get('host'),
//     port: config.get('port'),
//     username: config.get('username'),
//     password: config.get('password'),
//     dialect: config.get('dialect')
// })

// // Table
// const Genre = sequelize.define('genre', {
//     id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//     name: { type: DataTypes.STRING }
// }, DISABLE_SEQUELIZE_DEFAULTS);

// exports.sequelize = sequelize
// exports.Genre = Genre

// // ==========MYSQL===========
// const mysql = require('mysql');
// // Creating the Connection Object
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'vidly'
// });

// // Establish connection
// function makeDBConn() {
//     connection.connect(function (err) {
//         if (err) return console.error('error: ' + err.message);
//         console.log('Connection established.')
//         });
// };

// // Close the connection
// function closeDBConn() {
//     connection.end(function (err) {
//         if (err) return console.log('error: ' + err.message);
//         console.log('Connection closed.')
//     });
// };

// exports.connection = connection
// exports.makeDBConn = makeDBConn
// exports.closeDBConn = closeDBConn
// ==========MYSQL===========
