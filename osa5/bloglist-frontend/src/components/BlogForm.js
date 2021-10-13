import React, { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')


  const createBlog = (event) => {
    event.preventDefault()
    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Add a new</h2>
      <form onSubmit={createBlog}>
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th><input
                value={newTitle}
                onChange={(event) => { setNewTitle(event.target.value) }}
              /></th>
            </tr>
            <tr>
              <th>Author</th>
              <th><input
                value={newAuthor}
                onChange={(event) => { setNewAuthor(event.target.value) }}
              /></th>
            </tr>
            <tr>
              <th>Url</th>
              <th><input
                value={newUrl}
                onChange={(event) => { setNewUrl(event.target.value) }}
              /></th>
            </tr>
          </tbody>
        </table>
        <button type="submit">create</button>
      </form >
    </div>
  )
}

export default BlogForm