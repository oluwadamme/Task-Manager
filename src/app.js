const express = require('express');
require('./db/mongoose') //this line ensures that our mongoose automatically connects to the db
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports=app