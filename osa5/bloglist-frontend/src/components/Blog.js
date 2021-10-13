import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  const [likes, setLikes] = useState(blog.likes)
  const [visible, setVisible] = useState('')


  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    padding: 5,
    paddingLeft: 5,
    border: 'dotted',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonStyle = {
    marginLeft: 5,
    color: 'green'
  }

  const deleteButtonStyle = {
    backgroundColor: 'lightBlue'
  }


  const handleDelete = () => {
    if (window.confirm(`Do you want to delete ${blog.title}?`))
      deleteBlog(blog.id)
  }


  const handleLike = () => {
    updateBlog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes + 1,
      user: blog.user,
      id: blog.id
    })
    setLikes(likes + 1)
  }


  return (
    < div style={blogStyle} className='blog' >
      <div style={hideWhenVisible} className={'basic'} >
        {blog.title} {blog.author}
        <button style={buttonStyle} onClick={() => setVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible} className='advanced'>
        {blog.title} {blog.author} <button style={buttonStyle} onClick={() => setVisible(false)}>hide</button>
        <br />
        <a href={blog.url}>{blog.url}</a><br />
        likes: {likes}<button style={buttonStyle} onClick={() => handleLike()}>like</button><br />
        {blog.user.name}<br />
        {user.username === blog.user.username ?
          <button style={deleteButtonStyle} onClick={handleDelete}>delete</button> :
          <></>
        }
      </div>
    </div >
  )
}
export default Blog