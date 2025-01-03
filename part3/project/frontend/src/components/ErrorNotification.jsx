import PropTypes from 'prop-types'

const ErrorNotification = ({ message }) => {
    const notificationStyle = {
      color: 'red',
      background: 'lightgray',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
  
    if (message === null) {
      return null
    }
  
    return (
      <div className='error-message' style={notificationStyle}>
        {message}
      </div>
    )
  }

  ErrorNotification.propTypes = {
    message: PropTypes.string
  }
  
  export default ErrorNotification