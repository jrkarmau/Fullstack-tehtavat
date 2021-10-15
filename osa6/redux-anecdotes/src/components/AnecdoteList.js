import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createVote } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'


const Anecdote = ({ anecdote, handleClick }) => {

  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        Has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}


const Anecdotes = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(({ anecdotes, filter }) => (
    anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  ))

  anecdotes.sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(createVote(anecdote.id))
            dispatch(createNotification(`You voted ${anecdote.content}`))
          }
          }
        />
      )}
    </div>
  )
}

export default Anecdotes

