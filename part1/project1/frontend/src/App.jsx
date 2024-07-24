import { useEffect, useState } from 'react'
import imageService from './services/images'

function App() {
  const [imageUrl, setImageUrl] = useState(null)
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState(['TODO 1', 'TODO 2'])

  useEffect(() => {
    imageService
      .getImageUrl()
      .then(returnedImageUrl => {
        setImageUrl(returnedImageUrl)
      })
  }, [])

  const addTodo = (event) => {
    event.preventDefault()
    setTodo('')
  }

  return (
    <div>
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
