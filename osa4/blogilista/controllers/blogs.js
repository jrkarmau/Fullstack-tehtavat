const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blogs => blogs.toJSON()))
})


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})


blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  const blogToUpdate = await Blog.findById(request.params.id)

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  if (blogToUpdate.user.toString() === user.id.toString()) {
    const savedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    response.json(savedBlog.toJSON())
  } else {
    response.status(401).json({ error: 'unauthorized user' })
  }
})


blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).json({ error: 'invalid id' })
  }
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'unauthorized user' })
  }
})

module.exports = blogsRouter