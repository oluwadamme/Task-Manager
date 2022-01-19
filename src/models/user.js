const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim:true,
        minlength:7,
        validate(value){
            if (validator.contains(value.toLowerCase(),'password')) {
                throw new Error('Password is invalid')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

// virtual properties are not data stored in db but are relation between two entities
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // this is where the local data is stored. it is a relationship between Task-ownwer field
    foreignField:'owner' // this is the name of the field on the other entitiy(Task) that will create the relationship
})

// this is called instance methods
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id:user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token}) // Adding token to the user model
    user.save()
    return token
}

// step 1
// userSchema.methods.getPublicData = function () {
//     const user = this
//     const userObject = user.toObject() // to raw user data from mongoose

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }

// step 2 // this works on the smallercase instance object(user)
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject() // to raw user data from mongoose

    // this is to remove these parameters from the data response
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


// setting up the login function
// this helps us to set up dynamic functions that we can access in our user router
// statics methods are accessible on the model called model methods(Uppercase model)
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email}) // this is used to find our user with the particular email in the database

    if (!user) {
        throw new Error('User unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch) {
        throw new Error('User unable to login')
    }
    return user
}

// this is done to protect the user password (Hashing). this is a form of middleware
userSchema.pre('save', async function(next) {
    const user = this // 'this' gives us access to data for modification

    // Hashing the password
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user's tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})


// This model is use for validation
const User = mongoose.model('User', userSchema)

module.exports = User