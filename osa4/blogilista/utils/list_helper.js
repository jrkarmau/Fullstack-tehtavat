const { sum, max, indexOf } = require('lodash')
const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (prev, curr) => {
    return prev + curr.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const results = _.maxBy(blogs, 'likes')
  return {
    title: results.title,
    author: results.author,
    likes: results.likes
  }
}

const mostBlogs = (blogs) => {

  const author = _.chain(blogs).countBy('author').toPairs().max(_.last).head().value()
  const count = sum( blogs.map((blog => blog.author === author ? 1 : 0 )))
  if (!author) return {
    author: '',
    blogs: 0
  }
  return {
    author: author,
    blogs: count
  }
}

const mostLikes = (blogs) => {

  if(blogs.length < 1) return {
    author: '',
    likes: 0
  }

  const authorGroups = _.values(_.groupBy(blogs, 'author'))
  const likesArray = authorGroups.map(group => _.sumBy(group, 'likes'))
  const likes = max(likesArray)
  const author = authorGroups[indexOf(likesArray, likes)][0].author

  return {
    author: author,
    likes: likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}