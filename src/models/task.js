const mongoose = require('mongoose');

// This model is use for validation
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // this is the same as the one used in creating the user model for mongoose
    }
}, {
    timestamps: true
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task