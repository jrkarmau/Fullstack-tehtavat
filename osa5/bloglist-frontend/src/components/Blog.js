import React from 'react'

const Blog = ({blog}) => (
  <div>
    {blog.title} {blog.author}
  </div> 
)

export default Blog

//  <a href={blog.url}> {blog.url}</a> Likes: {blog.likes}