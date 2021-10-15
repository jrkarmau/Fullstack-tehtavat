import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'


const Notification = () => {

  const dispatch = useDispatch()
  const message = useSelector(state => state.notification)
  
  if (!message) return <div/>

  setTimeout(() => {
    dispatch(createNotification(''))
  }, 5000)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification