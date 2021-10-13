import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import './index.css'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import ShowBlogs from './components/ShowBlogs'
import PropTypes from 'prop-types'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [User, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])


  useEffect(() => {
    const UserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (UserJSON) {
      const User = JSON.parse(UserJSON)
      setUser(User)
      blogService.setToken(User.token)
    }
  }, [])


  const handleLogin = async (user) => {
    try {
      const loggedUser = await loginService.login(user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const updateBlog = (blog) => {
    try {
      blogService.update(blog.id, blog)
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = (id) => {
    try {
      blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id ))
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blog) => {
    try {
      const addedBlog = await blogService.create(blog)
      setBlogFormVisible(false)
      setBlogs(blogs.concat(addedBlog))
      setNotification(`added ${blog.title} written by ${blog.author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setErrorMessage('blog must have author OR url included')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>create new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm addBlog={addBlog} />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div >
      </div >
    )
  }

  ShowBlogs.propTypes = {
    user:PropTypes.object.isRequired,
    logOut: PropTypes.func.isRequired,
    blogs:PropTypes.array.isRequired,
    blogForm: PropTypes.func.isRequired,
    updateBlog: PropTypes.func.isRequired,
    deleteBlog:PropTypes.func.isRequired,


  }


  const showBlogs = () => (
    <ShowBlogs
      user={User}
      logOut={logOut}
      blogs={blogs}
      blogForm={blogForm}
      updateBlog={updateBlog}
      deleteBlog={deleteBlog}
    />
  )

  return (
    <div>
      <Notification message={notification} />
      <ErrorNotification message={errorMessage} />
      {User === null ?
        <LoginForm handleLogin={handleLogin} /> :
        showBlogs()
      }
    </div>
  )
}

export default App