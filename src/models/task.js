const mongoose = require('mongoose')

const tasks = mongoose.model('tasks', {
    description:
    {
        type: String,
        trim: true,
        required: true
    },
    completed:
    {
        type: Boolean,
        default: false
    },
    owner:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

module.exports = tasks
