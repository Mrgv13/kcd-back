require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DATEBUSER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DATEBASEPORT,
  database: process.env.DATEBASE
})


module.exports = pool
