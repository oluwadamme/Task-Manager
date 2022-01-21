const request = require('supertest');
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should signup a new user', async()=>{
   const response= await request(app).post('/users').send({
        name: 'Ayodeji',
        email:'ayodeji@yahoo.com',
        password:'test1234$'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertion about the response
    expect(response.body).toMatchObject({
        user:{
            name: 'Ayodeji',
        email:'ayodeji@yahoo.com',
        },token: user.tokens[0].token
    })
})

test('should login existing user', async()=>{
    const response =  await request(app).post('/users/login').send({
        
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    // Fetch user from database
    const user = await User.findById(response.body.user._id)
    // verify token
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('should not login non-existing user', async()=>{
   await request(app).post('/users/login').send({
        email:'ayodeji@email.com',
        password:'test1234'
    }).expect(400)
})

test('should get user profile', async()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get unauthenticated user profile', async()=>{
    await request(app)
    .get('/users/me')
    // .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(401)
})

test('should delete user account', async()=>{
   await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('should not delete unathenticated user account', async()=>{
    await request(app)
    .delete('/users/me')
    //.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(401)
})

test('should upload avatar image', async ()=>{
    await request(app)
     .post('/users/me/avatar')
     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
     .attach('avatar','tests/fixtures/profile-pic.jpg')
     .expect(200)

     const user = await User.findById(userOneId)
     expect(user.avatar).toEqual(expect.any(Buffer))
 })

test('should not update invalid user field', async ()=>{
   const response = await request(app)
     .patch('/users/me')
     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
     .send({location:'Ayomipo'})
     .expect(404)
 })
 
 test('should update user field', async ()=>{
    const response= await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({name:'Ayomipo'})
      .expect(200)
 
      const user = await User.findById(userOneId)
      expect(user.name).toEqual(response.body.name)
  })
 