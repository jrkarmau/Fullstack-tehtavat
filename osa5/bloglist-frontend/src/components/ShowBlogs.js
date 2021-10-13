import React from 'react'
import Blog from './Blog'

const ShowBlogs = ({
  user,
  logOut,
  blogs,
  blogForm,
  updateBlog,
  deleteBlog
}) => {

  blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <p>
        {user.name} logged in
        <button onClick={() => logOut()}> logout </button>
      </p>
      <h2 >Happy reading!</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          user={user}
          deleteBlog={deleteBlog}
        />
      )}
      {blogForm()}
    </div>

  )
}

export default ShowBlogs