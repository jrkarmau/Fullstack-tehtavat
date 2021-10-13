import React from 'react'

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="errorNotification">
      {message}
    </div>
  )

}

export default ErrorNotification