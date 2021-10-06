const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('getting blogs from DB', () => {

  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const authors = response.body.map(r => r.author)
    expect(authors).toContainEqual('Michael Chan')
  })

  test('"_id" is defined as "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('New blog is added', async () => {
    const newBlog = {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })
})

describe('adding blogs to db', () => {

  test('New specific blog is added', async () => {
    const newBlog = {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
    const response = await api.get('/api/blogs')
    const id = response.body.map(r => r.id)
    expect(id).toContainEqual('5a422b891b54a676234d17fa')
  })

  test('undefined "likes" as 0', async () => {
    const newBlog = {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      __v: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
    const response = await api.get('/api/blogs')
    expect(response.body[2].likes).toBe(0)
  })

  test('bad blogs returned with statuscode 400', async () => {
    const newBlog = {
      _id: '5a422b891b54a676234d17fa',
      author: 'Robert C. Martin',
      likes: 5,
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      __v: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('deleting and editing ', () => {

  test('a blog can be deleted', async () => {
    const blogToDelete = initialBlogs[0]
    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .expect(204)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(
      initialBlogs.length - 1
    )
    const contents = blogsAtEnd.body.map(r => r.id)
    expect(contents).not.toContain(blogToDelete._id)
  })

  test('a blog can be edited', async () => {
    const blogToEdit = {
      _id: '5a422a851b54a676234d17f7',
      title: 'testi',
      author: 'jrkarmau',
      url: 'https://github.com/jrkarmau/Fullstack-tehtavat',
      likes: 100,
      __v: 0
    }

    await api
      .put(`/api/blogs/${initialBlogs[0]._id}`)
      .send(blogToEdit)
      .expect(200)
    const blogsAtEnd = await api.get('/api/blogs')
    console.log(blogsAtEnd.body)
    const titles = blogsAtEnd.body.map(r => r.title)
    expect(titles).toContainEqual(blogToEdit.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})