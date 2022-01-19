const express = require('express');
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router()

// Task resources handler
// Create resource(router.post())
// Read resources (router.get())
// Update resource (router.patch())
// Delete resource (router.delete())

router.post('/tasks',auth,async(request, response)=>{

    const task = new Task({
        ...request.body , // this will copy all the request body to the object
        owner: request.user._id
    })
    try {
        await task.save()
        response.status(201).send(task)
    } catch (error) {
        response.status(400).send(error.message)
    }
})

// filtering our task 
// pagination of task using limit and skip properties
// sorting our task by timestamp
router.get('/tasks',auth,async(req,res)=>{
    // accepting query passed in by the user
    const match = {}
    const sort = {}

    if (req.query.completed) {
        // this sets completed to boolean true if the user query is true and vice versa
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const part = req.query.sortBy.split(':') // this returns a list
        sort[part[0]] = part[1] === 'desc' ? -1 : 1
    }
    try {
        //const tasks = await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks', match, 
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/tasks/:id', auth,async (req,res)=>{
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id})
        if (!task) {
            return res.status(400).send('Cannot find task with '+_id)
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.patch('/tasks/:id', auth, async(req,res)=>{
    const updates = Object.keys(req.body) // this is to convert the request body to an array of strings
    const allowedUpdates = ['description', 'completed'] // these are allowed parameters users can update
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // This function checks if the parameter(s) to be updated is valid
    
    if (!isValidOperation) {
        return res.status(404).send({error:'Invalid parameter(s) to update'})
    }
    try {
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete('/tasks/:id', auth, async (req,res)=>{
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({error: 'user with id ('+req.params.id.toString()+') not found'})
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router