const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const tasks = require('./models/task')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// user
app.use(userRouter)

// task
app.use(taskRouter)

app.listen(port, () => {
    console.log("server is up on port: " + port)
})
