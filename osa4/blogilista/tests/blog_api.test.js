const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helpers')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs and user saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('all blogs are returned as json', async () => {
    const blogsAtEnd = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blogsAtEnd = await api.get('/api/blogs')
    const authors = blogsAtEnd.body.map(r => r.author)
    expect(authors).toContainEqual('Michael Chan')
  })


  describe('viewing a specific blog', () => {

    test('"_id" is defined as "id"', async () => {
      const blogsAtEnd = await api.get('/api/blogs')
      expect(blogsAtEnd.body[0].id).toBeDefined()
    })

    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const processeBlogToView = JSON.parse(JSON.stringify(blogToView))
      expect(resultBlog.body[0]).toEqual(processeBlogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })
  })


  describe('addition of a new blog', () => {

    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'First class tests in this test',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
      }

      const body = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      console.log(body.token)


      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      expect(titles).toContain('First class tests in this test')
    })


    test('undefined "likes" as 0', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[2].likes).toBe(0)
    })


    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        likes: 5
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deleting and editing ', () => {

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const contents = blogsAtEnd.map(r => r.id)
      expect(contents).not.toContain(blogToDelete.id)
    })


    test('a blog can be edited', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToEdit = {
        title: 'testi',
        author: 'testi',
        url: 'https://github.com/jrkarmau/Fullstack-tehtavat',
        likes: 100,
      }

      await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(blogToEdit)
        .expect(200)
      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).toContainEqual('testi')
    })
  })


  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testi',
      name: 'Jovan Karmakka',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is invalid', async () => {

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 's'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password or username too short')
  })


  test('creation fails with proper statuscode and message if username is invalid', async () => {

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password or username too short')
  })
})

afterAll(() => {
  mongoose.connection.close()
})