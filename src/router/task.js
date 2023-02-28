const express = require('express')
const tasks = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// creating a task
router.post('/tasks', auth, async (req, res) => {
    // const task = new tasks(req.body)
    const task = new tasks({
        ...req.body,
        owner: req.user._id
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

// For finding all tasks Using completed:true or completed:false
// GET /tasks?limit=2&skip=4
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate(
            {
                path: 'tasks',
                match,
                options:
                {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }
        )
        res.send(req.user.tasks)
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
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const aTask = await tasks.findById(_id)
        const aTask = await tasks.findOne({ _id, owner: req.user._id })
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
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const validation = updates.every((updates) => {
        return allowedUpdates.includes(updates)
    })
    if (!validation) {
        res.status(400).send()
    }
    try {
        const taskForUpdate = await tasks.findOne({ _id: req.params.id, owner: req.user._id })

        if (!taskForUpdate) {
            res.status(404).send()
        }

        updates.forEach((update) => taskForUpdate[update] = req.body[update])
        await taskForUpdate.save()
        res.send(taskForUpdate)
    } catch (e) {
        res.status(400).send(e)
    }
})

// deleting a task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const taskForDelete = await tasks.findByIdAndDelete(req.params.id)
        const taskForDelete = await tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!taskForDelete) {
            return res.status(404).send()
        }
        res.send(taskForDelete)
    } catch {
        res.status(500).send()
    }
})

module.exports = router