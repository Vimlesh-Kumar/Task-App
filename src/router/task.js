const express = require('express')
const tasks = require('../models/task')
const auth=require('../middleware/auth')
const router = new express.Router()

// creating a task
router.post('/tasks',auth,async (req, res) => {
    // const task = new tasks(req.body)
    const task=new tasks({
        ...req.body,
        owner:req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// For finding all tasks
router.get('/tasks', async (req, res) => {

    try {
        const allTasks = await tasks.find({})
        res.send(allTasks)
    } catch (e) {
        res.status(500).send()
    }

    // tasks.find({}).then((allTasks) => {
    //     res.send(allTasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

// for finding a task
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const aTask = await tasks.findById(_id)
        if (!aTask) {
            return res.status(404).send()
        }
        res.send(aTask)

    } catch (e) {
        res.status(500).send()
    }

    // tasks.findById(_id).then((aTask) => {
    //     if (!aTask) {
    //         return res.status(404).send()
    //     }
    //     res.send(aTask)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

// updating task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const validation = updates.every((updates) => {
        return allowedUpdates.includes(updates)
    })
    if (!validation) {
        res.status(400).send()
    }
    try {
        const taskForUpdate =await tasks.findById(req.params.id)
        updates.forEach((update) => taskForUpdate[update] = req.body[update])
        await taskForUpdate.save()
        // const taskForUpdate = await tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!taskForUpdate) {
            res.status(404).send()
        }
        res.send(taskForUpdate)
    } catch (e) {
        res.status(400).send(e)
    }
})


// deleting a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const taskForDelete = await tasks.findByIdAndDelete(req.params.id)
        if (!taskForDelete) {
            return res.status(404).send
        }
        res.send(taskForDelete)
    } catch {
        res.status(500).send()
    }
})

module.exports = router