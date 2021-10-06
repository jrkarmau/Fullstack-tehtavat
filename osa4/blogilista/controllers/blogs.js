const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (!blog.title || !blog.url) {
    response.status(400).json(blog)
  } else {
    await blog.save()
    response.status(201).json(blog)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    _id: body._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    __v: body.__v
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter