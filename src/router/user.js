const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// creating a user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

// user logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// logout of ALL Session
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// for finding all users
// router.get('/users', async (req, res) => {
//     try {
//         const allUsers = await User.find({})
//         res.send(allUsers)
//     } catch (e) {
//         res.status(500).send()
//     }
//     // User.find({}).then((allusers) => {
//     //     res.send(allusers)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// // for finding a single user
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const aSingleUser = await User.findById(_id)
//         if (!aSingleUser) {
//             return res.status(404).send()
//         }
//         res.send(aSingleUser)
//     } catch (e) {
//         res.status(500).send()
//     }
//     // User.findById(_id).then((aSingleUser) => {
//     //     if (!aSingleUser) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(aSingleUser)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })

// })

// updating a usser
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const validation = updates.every((updates) => {
        return allowedUpdates.includes(updates)
    })

    if (!validation) {
        return res.status(400).send()
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// deleting a user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch {
        res.status(500).send()
    }
})

module.exports = router