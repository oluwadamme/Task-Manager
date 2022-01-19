const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user')
const auth = require('../middleware/auth');
const {sendWelcomeMail, sendClosingMail} = require('../emails/account')

const router = express.Router()
// Users endpoints creation
// 'request, req' is to collect data from the frontend user
// 'response, res' is to send data from the backend
// Create resource(router.post())
// Read resources (router.get())
// Update resource (router.patch())
// Delete resource (router.delete())


// setting up sign up endpoint for users
router.post('/users', async(req, res)=>{
    const user = new User(req.body)

    try {
        sendWelcomeMail(user.email, user.name)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// setting up login endpoint for users
router.post('/users/login', async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    // this is done by removing the token the user used to login on a particular device
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
            // if this is true, it returns true and the token will removed from the tokens array
        })
        await req.user.save()
        res.send(req.user)

    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// Read resources
router.get('/users/me',auth,async(req,res)=>{
    
    try {
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.patch('/users/me',auth, async(req,res)=>{
    // add an error handling function

    const updates = Object.keys(req.body) // this is to convert the request body to an array of strings
    const allowedUpdates = ['name', 'email', 'password', 'age'] // these are allowed parameters users can update
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update)) // This function checks if the parameter(s) to be updated is valid
    
    if (!isValidOperation) {
        return res.status(404).send({error:'Invalid parameter(s) to update'})
    }
    try {
        //const user = await User.findById(req.user._id)
        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.delete('/users/me', auth, async (req,res)=>{
    try {
        sendClosingMail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload a image'))
        }
        callback(undefined,true)
    }
})

// upload user profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=>{
    // resizing image size and using a uniform file type 
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

// delete user profile picture
router.delete('/users/me/avatar',auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
},(error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

// fetch user avatar by id
router.get('/users/:id/avatar', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
        throw new Error()
    }

    res.set('Content-Type','image/png')
    res.send(user.avatar)
    } catch (error) {
        res.status(400).send()
    }
    
})

module.exports = router