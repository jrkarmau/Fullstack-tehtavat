import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )


  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }


  const addBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title: newTitle,
      author: newAuthor,
      url: newAuthor
    }

    try {
      const addedBlog = await blogService.create(blog)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setBlogs(blogs.concat(addedBlog))
      setNotification(`added ${blog.title} written by ${blog.author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      console.log('lisätty');
    } catch (error) {
      setErrorMessage('blog must have author OR url included')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const BlogForm = () => (
    <form onSubmit={addBlog}>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th><input
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            /></th>
          </tr>
          <tr>
            <th>Author</th>
            <th><input
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            /></th>
          </tr>
          <tr>
            <th>Url</th>
            <th><input
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            /></th>
          </tr>
        </tbody>
      </table>
      <button type="submit">save</button>
    </form >
  )


  const showBlogs = () => (
    <div>
      <p>
        {user.name} logged in
        <button onClick={() => logOut()}> logout </button>
      </p>
      <h2>Happy reading!</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <h2>Add a new</h2>
      {BlogForm()}
    </div>
  )


  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} />
      <ErrorNotification message={errorMessage} />
      {user === null ?
        loginForm() :
        showBlogs()
      }
    </div>
  )
}

export default App