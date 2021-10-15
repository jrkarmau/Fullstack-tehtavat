import React from "react"
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'


const NewAnecdote = (props) => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdoteInput.value
    event.target.anecdoteInput.value = ''
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
    dispatch(createNotification(`Created anecdote ${newAnecdote}`))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdoteInput' /></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default NewAnecdote