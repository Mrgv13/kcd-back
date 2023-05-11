require('dotenv').config()

const express = require('express')
const userRouter = require('./routes/user.routes')
const projectRouter = require('./routes/project.routes')
const worksRouter = require('./routes/works.routes')
const works_attributesRouter = require('./routes/works_attributes.routes')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')


const PORT = process.env.PORT || 5050

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', userRouter)
app.use('/api-project', projectRouter )
app.use('/api-works', worksRouter )
app.use('/works_attributes', works_attributesRouter )

// catch error
app.use(errorHandler)

const start = async () => {
  try {

    await sequelize.authenticate()
    await sequelize.sync()

    app.listen(PORT, () => {
      console.log(`server start on ${PORT} port`)
    })

  } catch (e){
    console.log(e)
  }
}

start()

