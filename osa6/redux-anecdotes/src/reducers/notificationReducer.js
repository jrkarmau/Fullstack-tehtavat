export const createNotification = (message) => {
  return {
    type: 'SET_NOTIFICATION',
    message: message
  }
}


const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.message
    default:
      return state
  }
}

export default notificationReducer