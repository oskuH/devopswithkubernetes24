import { useEffect, useState } from 'react'
import imageService from './services/images'
import todoService from './services/todos'
import ErrorNotification from './components/ErrorNotification'

function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])

  useEffect(() => {
    imageService
      .getImageUrl()
      .then(returnedImageUrl => {
        setImageUrl(returnedImageUrl)
      })
  }, [])

  useEffect(() => {
    todoService
      .getAll()
      .then(returnedTodos => {
        setTodos(returnedTodos)
      })
  }, [])

  const addTodo = (event) => {
    event.preventDefault()
    todoService
      .create({todo: todo})
      .then(returnedTodo => {
        setTodos(todos.concat(returnedTodo))
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <img src={imageUrl} alt="From server" />
      <form onSubmit={addTodo}>
          <input
          className='todo-input'
          type='text' 
          value={todo} 
          name='todo'
          maxLength={140}
          onChange={({ target }) => setTodo(target.value)}
        />
        <button className='todo-submit-button' type='submit'>Create TODO</button>
      </form>
      <div className='listed-todos'>
        <ul style={{ listStyleType: 'disc' }}>
        {todos
          .map(entry =>
            <li key={entry}>{entry}</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default App
