// CRUD create read update delete

const { MongoClient, ObjectID } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
console.log(id.getTimestamp());

MongoClient.connect(connectionUrl, {useNewUrlParser:true}, (error, client)=>{
    if (error) {
        return console.log('Unable to connect to database!!!')
    }

    const db = client.db(databaseName)

    // db.collection('users').deleteMany({
    //     age: 22
    
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });
    // db.collection('users').deleteOne({
    //     age: 23
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });

    // db.collection('courses').updateMany({
    //     completed: false
    // },{
    //     $set:{
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });


    // db.collection('users').updateOne({
    //     _id: new ObjectID("61dcd6ac7d38e157b4d49abf")
    // },{
    //     $set:{
    //         name: 'Dammie'
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });
    // db.collection('users').updateOne({
    //     _id: new ObjectID("61dcd6ac7d38e157b4d49abf")
    // },{
    //     $inc:{
    //         age: -1
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });


   

    // db.collection('users').findOne({_id: new ObjectID("61dcd6ac7d38e157b4d49abf")}, (error,user)=>{
    //     if (error) {
    //         return console.log('Unable to fetch document!!')
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({age:23}).toArray((error,user)=>{
    //     console.log(user);
    // })
    // db.collection('courses').findOne({description: 'EEG 502'}, (error,course)=>{
    //     if (error) {
    //         return console.log('Unable to fetch document!!')
    //     }
    //     console.log(course)
    // })

    // db.collection('courses').find({completed:false}).toArray((error,course)=>{
    //     console.log(course);
    // })
    // db.collection('users').findOne({name: 'Damilola'}, (error,user)=>{
    //     if (error) {
    //         return console.log(error)
    //     }
    //     console.log(user)
    // })
    // db.collection('users').insertOne({
    //     name: 'Damilola',
    //     age: 23
    // }, (error, result)=>{
    //     if (error) {
    //         return console.log('Unable to connect to database!!!')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([{
    //     name: 'Damilola',
    //     age: 23
    // },{
    //     name: 'Abisola',
    //     age: 20 
    // }], (error, result)=>{
    //     if (error) {
    //         return console.log('Unable to insert documents!!!')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('courses').insertMany([
    //     {
    //         description: "EEG 506",
    //         completed: true
    //     },
    //     {
    //         description: "MEE 506",
    //         completed: false
    //     },
    //     {
    //         description: "EEG 502",
    //         completed: false
    //     }
    // ], (error,result)=>{
    //     if (error) {
    //         return console.log('Unable to add documents')
    //     }

    //     console.log(result.ops)
    // })
})