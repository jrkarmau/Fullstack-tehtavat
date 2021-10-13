import React, { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const createUser = (event) => {
    event.preventDefault()
    handleLogin({
      username: username,
      password: password
    })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h1>Blogs</h1>
      <form onSubmit={(createUser)}>
        <div>
          username
          <input
            id='username'
            value={username}
            name='username'
            onChange={(event) => { setUsername(event.target.value)}}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type='password'
            name='password'
            value={password}
            onChange={(event) => { setPassword(event.target.value)}}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )
}
export default LoginForm