const Pool = require('pg').Pool
const {Sequelize} = require('sequelize')

const pool = new Sequelize(
  process.env.DATEBASE,
  process.env.DATEBUSER,
  process.env.PASSWORD,
  {
    dialect: "postgres",
    host: process.env.HOST,
    port: process.env.DATEBASEPORT
  }
  // user: process.env.DATEBUSER,
  // password: process.env.PASSWORD,
  // host: process.env.HOST,
  // port: process.env.DATEBASEPORT,
  // database: process.env.DATEBASE
)


module.exports = pool
