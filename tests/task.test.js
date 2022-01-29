const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOneId, userOne, userTwo, userTwoId,taskTwo,taskOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create task for user', async()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({description:'create task test', completed:true})
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('should get tasks for particular user', async()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    //const task = await Task.findById(response.body._id)
    expect(response.body.length).toBe(2)
})

test('should not delete unauthorise user tasks', async()=>{
    const response = await request(app)
    .delete('/tasks/'+taskOne._id)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = Task.findById(taskOne._id)
     expect(task).not.toBeNull()
})